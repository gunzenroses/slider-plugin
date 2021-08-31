import { throttle } from "throttle-typescript";
import { IPresenter } from "mvp/presenter";
import checkValidity from "helpers/checkValidity";
import { TSettings, TPanelParam, TFunc } from "utils/types";
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
  private listOfPanelItems!: Array<TPanelParam>;

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
    this.assignData();
    this.init();
    this.updatePanel();
  }

  private assignData(): void {
    this.data = this.presenter.data;
  }

  init(): void {
    this.render(this.data);
    this.createChildren();
    this.setupHandlers();
    this.enable();
  }

  private createChildren(): void {
    this.checkboxes = this.panelContainer.querySelectorAll("input[type='checkbox']");
    this.numberInputs = this.panelContainer.querySelectorAll("input[type='number']");
    this.orientationInput = <HTMLInputElement>(
      this.panelContainer.querySelector('select[name="orientation"]')
    );
    this.minInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="min"]');
    this.maxInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="max"]');
    this.stepInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="step"]');
    this.currentFirstInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="currentFirst"]')
    );
    this.currentSecondInput = <HTMLInputElement>(
      this.panelContainer.querySelector('input[name="currentSecond"]')
    );
    this.data.range
      ? (this.currentSecondInput.disabled = false)
      : (this.currentSecondInput.disabled = true);
  }

  private setupHandlers(): void {
    this.changePanelHandler = this.changePanel.bind(this);
    this.updateHandler = this.updatePanel.bind(this);
    this.updateThumbHandler = this.updateThumb.bind(this);
    this.updateThumbSecondHandler = this.updateThumbSecond.bind(this);
  }

  private enable(): void {
    this.panelItems.addEventListener("change", throttle(this.changePanelHandler, 300));

    this.presenter.fromPresenterUpdate.add(this.updateHandler as TFunc);
    this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler as TFunc);
    this.presenter.fromPresenterThumbSecondUpdate.add(this.updateThumbSecondHandler as TFunc);
  }

  updatePanel(): void {
    this.assignData();
    this.updateMin();
    this.updateMax();
    this.updateStep();
    this.updateThumb();
    this.updateThumbSecond();
  }

  updateThumb(): void {
    this.currentFirstInput.value = this.data.currentFirst.toString();
    this.currentFirstInput.min = this.data.min.toString();
    this.currentFirstInput.max = this.data.currentSecond.toString();
    this.currentFirstInput.step = this.data.step.toString();
  }

  updateThumbSecond(): void {
    this.currentSecondInput.min = this.data.currentFirst.toString();
    this.currentSecondInput.max = this.data.max.toString();
    this.currentSecondInput.value = this.data.currentSecond.toString();
    this.currentSecondInput.step = this.data.step.toString();
    this.data.range
      ? (this.currentSecondInput.disabled = false)
      : ((this.currentSecondInput.disabled = true),
        (this.currentSecondInput.value = this.data.max.toString()));
  }

  private updateStep(): void {
    this.stepInput.value = this.data.step.toString();
    this.stepInput.min = "1";
    this.stepInput.max = (this.data.max - this.data.min).toString();
  }

  private updateMin(): void {
    this.minInput.value = this.data.min.toString();
    this.minInput.min = "0";
    this.minInput.max = this.data.max.toString();
  }

  private updateMax(): void {
    this.maxInput.value = this.data.max.toString();
    this.maxInput.min = (this.data.min + this.data.step).toString();
  }

  changePanel(e: Event): void {
    const element = e.target as HTMLInputElement;
    const name = element.getAttribute("name") as string;
    const type = element.getAttribute("type") as string;
    const data =
      type === "checkbox"
        ? element.checked
        : type === "number"
        ? parseInt(element.value)
        : element.value;
    if (type === "number") {
      this.validation = new checkValidity(element, this.panelContainer);
    }
    this.assignChangingObject(name);
    this.modelData(type, name, data);
  }

  assignChangingObject(name: string): void {
    this.presenter.changingObject =
      name === "currentFirst"
        ? this.presenter.view.sliderThumb.element
        : name === "currentSecond"
        ? this.presenter.view.sliderThumbSecond.element
        : null;
  }

  modelData(type: string, name: string, data: string | boolean | number): void {
    type === "number"
      ? setTimeout(() => {
          this.presenter.modelData(name, data);
        })
      : this.presenter.modelData(name, data);
  }

  render(data: TSettings): void {
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
    for (const item of this.listOfPanelItems) {
      this.panelItems.innerHTML += this.createPanelItem(item);
    }
  }

  private createPanelItem(params: TPanelParam): string {
    const element = `<div class= "panel__item">${this.panelItemName(
      params.text
    )} ${this.panelItemInput(params)}</div>`;
    return element;
  }

  private panelItemName(text: string): string {
    return `<div class= "panel__name">${text}</div>`;
  }

  private panelItemInput(params: TPanelParam): string {
    const options = params.options as Array<string>;
    return params.type === "number"
      ? `<input class="panel__input" name= ${params.name} type= ${params.type} value= ${params.value} required/>`
      : params.type === "checkbox"
      ? `<input class="panel__input" name= ${params.name} type= ${params.type} ${params.value}/>`
      : params.type === "select"
      ? `<${params.type} class="panel__input" name= ${params.name}> 
            ${options.map((el: string) => this.selectOptions(el)).join("")} 
        </${params.type}>`
      : "";
  }

  private selectOptions(arg: string): string {
    return arg === this.data.orientation
      ? `<option selected value="${arg}">${arg}</option> `
      : `<option value="${arg}">${arg}</option> `;
  }
}

export { IPanel, ConfigurationPanel };
