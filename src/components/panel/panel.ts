import { throttle } from "throttle-typescript";
import { IPresenter } from "mvp/presenter";
import checkValidity from "helpers/checkValidity";
import { TSettings, TPanelParam } from "utils/types";
import { afterCustomElement, appendCustomElement } from "utils/common";

interface IPanel {
  presenter: IPresenter;
  parentContainer: HTMLElement;
  data: TSettings;
  init(): void;
  render(data: TSettings): void;
  changePanel(event: Event): void;
  updatePanel(): void;
  updateThumb(): void;
  updateThumbSecond(): void;
  validation: checkValidity;
}

class ConfigurationPanel implements IPanel {
  presenter: IPresenter;
  parentContainer: HTMLElement;
  data!: TSettings;

  panelContainer: HTMLElement;
  panelItems: HTMLElement;
  private listOfPanelItems!: any;

  checkboxes!: NodeListOf<HTMLElement>;
  minInput!: HTMLInputElement;
  maxInput!: HTMLInputElement;
  stepInput!: HTMLInputElement;
  currentFirstInput!: HTMLInputElement;
  currentSecondInput!: HTMLInputElement;
  orientationInput!: HTMLInputElement;
  numberInputs!: NodeListOf<Element>;
  validation!: checkValidity;

  updateHandler!: { (data: TSettings): void };
  changePanelHandler!: { (event: Event): void };
  updateThumbHandler!: { (number: number): void };
  updateThumbSecondHandler!: { (number: number): void };

  constructor(container: HTMLElement, presenter: IPresenter) {
    this.parentContainer = container;
    this.panelContainer = afterCustomElement("div", "panel", this.parentContainer);
    this.panelItems = appendCustomElement("div", "panel__items", this.panelContainer);
    this.presenter = presenter;
    this.getData();
    this.init();
    this.updatePanel();
  }

  private getData() {
    this.data = this.presenter.data;
  }

  init() {
    this.render(this.data);
    this.createChildren();
    this.setupHandlers();
    this.enable();
  }

  private createChildren() {
    this.checkboxes = this.panelContainer.querySelectorAll("input[type='checkbox']");
    this.numberInputs = this.panelContainer.querySelectorAll("input[type='number']");
    this.orientationInput = <HTMLInputElement>(
      this.panelContainer.querySelector('select[name="orientation"]')
    );
    this.minInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="min"]')
    );
    this.maxInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="max"]')
    );
    this.stepInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="step"]')
    );
    this.currentFirstInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="currentFirst"]')
    );
    this.currentSecondInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="currentSecond"]')
    );
    if (!this.data.range) {
      this.currentSecondInput.disabled = true;
    }
  }

  private setupHandlers() {
    this.changePanelHandler = this.changePanel.bind(this);
    this.updateHandler = this.updatePanel.bind(this);
    this.updateThumbHandler = this.updateThumb.bind(this);
    this.updateThumbSecondHandler = this.updateThumbSecond.bind(this);
  }

  private enable() {
    for (let item of this.checkboxes) {
      item.addEventListener("change", throttle(this.changePanelHandler, 300));
    }
    this.orientationInput.addEventListener(
      "change",
      throttle(this.changePanelHandler, 300)
    );
    for (let item of this.numberInputs) {
      item.addEventListener("change", throttle(this.changePanelHandler, 300));
    }

    this.presenter.fromPresenterUpdate.add(this.updateHandler);
    this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler);
    this.presenter.fromPresenterThumbSecondUpdate.add(
      this.updateThumbSecondHandler
    );
  }

  updatePanel() {
    this.getData();
    this.updateMin();
    this.updateMax();
    this.updateStep();
    this.updateThumb();
    this.updateThumbSecond();
  }

  updateThumb() {
    this.currentFirstInput.value = this.data.currentFirst;
    this.currentFirstInput.min = this.data.min;
    this.currentFirstInput.max = this.data.currentSecond;
    this.currentFirstInput.step = this.data.step;
  }

  updateThumbSecond() {
    this.currentSecondInput.min = this.data.currentFirst;
    this.currentSecondInput.max = this.data.max;
    this.currentSecondInput.value = this.data.currentSecond;
    this.currentSecondInput.step = this.data.step;
    this.data.range
      ? (this.currentSecondInput.disabled = false)
      : (this.currentSecondInput.disabled = true);
  }

  private updateStep() {
    this.stepInput.value = this.data.step;
    this.stepInput.min = "1";
    this.stepInput.max = (this.data.max - this.data.min).toString();
  }

  private updateMin() {
    this.minInput.value = this.data.min;
    this.minInput.min = "0";
    this.minInput.max = this.data.max;
  }

  private updateMax() {
    this.maxInput.value = this.data.max;
    this.maxInput.min = this.data.min + this.data.step;
  }

  changePanel(e: Event) {
    let element = e.target as HTMLInputElement;
    let name: string = element.getAttribute("name")!;
    let type = element.getAttribute("type");
    let data =
      type === "checkbox"
        ? element.checked
        : type === "number"
        ? parseInt(element.value)
        : element.value;
    if (name === "currentFirst") {
      this.presenter.changingObject = this.presenter.view.sliderThumb!;
    }
    if (name === "currentSecond") {
      this.presenter.changingObject = this.presenter.view.sliderThumbSecond!;
    }
    if (type === "number") {
      this.validation = new checkValidity(element, this.panelContainer);
      setTimeout(() => {
        this.presenter.modelData(name, data);
      });
    } else {
      this.presenter.modelData(name, data);
    }
  }

  render(data: TSettings) {
    this.listOfPanelItems = [
      {
        name: "min",
        text: "min",
        value: data.min,
        type: "number",
      },
      {
        name: "max",
        text: "max",
        value: data.max,
        type: "number",
      },
      {
        name: "step",
        text: "step",
        value: data.step,
        type: "number",
      },
      {
        name: "currentFirst",
        text: "from",
        value: data.currentFirst,
        type: "number",
      },
      {
        name: "currentSecond",
        text: "to",
        value: data.currentSecond,
        type: "number",
      },
      {
        name: "orientation",
        text: "orient",
        value: data.orientation,
        type: "select",
        options: ["horizontal", "vertical"],
      },
      {
        name: "range",
        text: "range",
        value: data.range ? "checked" : "",
        type: "checkbox",
      },
      {
        name: "scale",
        text: "scale",
        value: data.scale ? "checked" : "",
        type: "checkbox",
      },
      {
        name: "tooltip",
        text: "tooltip",
        value: data.tooltip ? "checked" : "",
        type: "checkbox",
      },
    ];

    this.panelItems.innerHTML = "";
    for (let item of this.listOfPanelItems) {
      this.panelItems.innerHTML += this.createPanelItem(item);
    }
  }

  private createPanelItem(params: TPanelParam) {
    let element = `<div class= "panel__item">${this.panelItemName(
      params.text
    )} ${this.panelItemInput(params)}</div>`;
    return element;
  }

  private panelItemName(text: string) {
    return `<div class= "panel__name">${text}</div>`;
  }

  private panelItemInput(params: TPanelParam) {
    return params.type === "number"
      ? `<input class="panel__input" name= ${params.name} type= ${params.type} value= ${params.value} required/>`
      : params.type === "checkbox"
      ? `<input class="panel__input" name= ${params.name} type= ${params.type} ${params.value}/>`
      : params.type === "select"
      ? `<${params.type} class="panel__input" name= ${params.name}> ${params
          .options!.map((el: String) => this.selectOptions(el))
          .join("")} </${params.type}>`
      : null;
  }

  private selectOptions(arg: String) {
    return arg === this.data.orientation
      ? `<option selected value="${arg}">${arg}</option> `
      : `<option value="${arg}">${arg}</option> `;
  }
}


export { IPanel, ConfigurationPanel }