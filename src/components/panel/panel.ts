import checkValidity from "Helpers/checkValidity";
import { TSettings, TPanelParam, TListener, IModelData } from "Utils/types";
import { afterCustomElement, appendCustomElement } from "Utils/common";
import IPresenter from "Interfaces/IPresenter";
import IPanel from "Interfaces/IPanel";

export default class Panel implements IPanel {
  presenter: IPresenter;
  panelContainer: HTMLElement;
  private panelItems: HTMLElement;

  data!: TSettings;
  private listOfPanelItems!: Array<TPanelParam>;
  private minInput!: HTMLInputElement;
  private maxInput!: HTMLInputElement;
  private stepInput!: HTMLInputElement;
  private currentFirstInput!: HTMLInputElement;
  private currentSecondInput!: HTMLInputElement;

  updateHandler!: { (data: TSettings): void };
  changePanelHandler!: { (evt: Event): void };
  updateThumbHandler!: { (num: string): void };
  updateThumbSecondHandler!: { (num: string): void };

  constructor(container: HTMLElement, presenter: IPresenter) {
    this.panelContainer = afterCustomElement("div", "panel", container);
    this.panelItems = appendCustomElement("div", "panel__items", this.panelContainer);
    this.presenter = presenter;
    this.init();
    this.updatePanel();
  }

  init(): void {
    this.assignData();
    this.render(this.data);
    this.createChildren();
    this.setupHandlers();
    this.enable();
  }

  private assignData(): void {
    this.data = this.presenter.data;
  }

  private createChildren(): void {
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
    this.panelItems.addEventListener("change", this.changePanelHandler);
    this.presenter.fromPresenterUpdate.add(this.updateHandler as TListener);
    this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler as TListener);
    this.presenter.fromPresenterThumbSecondUpdate.add(this.updateThumbSecondHandler as TListener);
  }

  updatePanel(): void {
    this.assignData();
    this.updateMin();
    this.updateMax();
    this.updateStep();
    this.updateThumb();
    this.updateThumbSecond();
  }

  private updateThumb(val?: string): void {
    val
      ? ((this.currentFirstInput.value = val),
        (this.data.currentFirst = parseInt(val)),
        (this.currentSecondInput.min = val))
      : (this.currentFirstInput.value = this.data.currentFirst);
    this.currentFirstInput.min = this.data.min;
    this.currentFirstInput.max = this.data.currentSecond;
    this.currentFirstInput.step = this.data.step;
  }

  private updateThumbSecond(val?: string): void {
    val
      ? ((this.currentSecondInput.value = val),
        (this.data.currentSecond = val),
        (this.currentFirstInput.max = val))
      : (this.currentSecondInput.value = this.data.currentSecond);
    this.currentSecondInput.min = this.data.currentFirst;
    this.currentSecondInput.max = this.data.max;
    this.currentSecondInput.step = this.data.step;
    this.data.range
      ? (this.currentSecondInput.disabled = false)
      : ((this.currentSecondInput.disabled = true),
        (this.currentSecondInput.value = this.data.max));
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
    const data = type === "checkbox" ? element.checked : element.value;
    if (type === "number") {
      new checkValidity(element, this.panelContainer);
    }
    this.assignChangingObject(name);
    this.modelData(type, name, data);
  }

  private assignChangingObject(name: string): void {
    this.presenter.changingObject =
      name === "currentFirst"
        ? this.presenter.view.thumb.element
        : name === "currentSecond"
        ? this.presenter.view.thumbSecond.element
        : null;
  }

  private modelData(type: string, name: string, data: IModelData): void {
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
