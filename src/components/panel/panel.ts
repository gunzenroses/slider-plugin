import checkValidity from "Helpers/checkValidity";
import { TSettings, TPanelParam, TListener, TModelData, TOrient } from "Utils/types";
import { afterCustomElement, appendCustomElement } from "Utils/common";
import IPresenter from "Interfaces/IPresenter";
import IPanel from "Interfaces/IPanel";

export default class ConfigurationPanel implements IPanel {
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
    this.presenter.eventDispatcher.add("updateAll", this.updateHandler);
    this.presenter.eventDispatcher.add("thumbUpdate", this.updateThumbHandler);
    this.presenter.eventDispatcher.add("thumbSecondUpdate", this.updateThumbSecondHandler);
  }

  updatePanel(): void {
    this.assignData();
    this.updateMin();
    this.updateMax();
    this.updateStep();
    this.updateThumb();
    this.updateThumbSecond();
  }

  private updateMin(): void {
    this.minInput.value = this.data.min.toString();
    this.minInput.max = this.data.max.toString();
  }

  private updateMax(): void {
    this.maxInput.value = this.data.max.toString();
    this.maxInput.min = (this.data.min + this.data.step).toString();
  }

  private updateStep(): void {
    this.stepInput.value = this.data.step.toString();
    this.stepInput.min = "1";
    this.stepInput.max = (this.data.max - this.data.min).toString();
  }

  private updateThumb(val?: string): void {
    val
      ? ((this.currentFirstInput.value = val),
        (this.data.currentFirst = parseInt(val)),
        (this.currentSecondInput.min = val))
      : (this.currentFirstInput.value = this.data.currentFirst.toString());
    this.currentFirstInput.min = this.data.min.toString();
    this.currentFirstInput.max = this.data.currentSecond.toString();
    this.currentFirstInput.step = this.data.step.toString();
  }

  private updateThumbSecond(val?: string): void {
    val
      ? ((this.currentSecondInput.value = val.toString()),
        (this.data.currentSecond = parseInt(val)),
        (this.currentFirstInput.max = val))
      : (this.currentSecondInput.value = this.data.currentSecond.toString());
    this.currentSecondInput.min = this.data.currentFirst.toString();
    this.currentSecondInput.max = this.data.max.toString();
    this.currentSecondInput.step = this.data.step.toString();
    this.data.range
      ? (this.currentSecondInput.disabled = false)
      : ((this.currentSecondInput.disabled = true),
        (this.currentSecondInput.value = this.data.max.toString()));
  }

  changePanel(e: Event): void {
    if (e.target == null)  return;
    const element = <HTMLInputElement>e.target;
    const name = element.getAttribute("name");
    const type = element.getAttribute("type");
    const data = type === "checkbox" ? element.checked : element.value;
    if (type === "number") {
      new checkValidity(element, this.panelContainer);
    }
    if (name == null || type === null) return;
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

  private modelData(type: string, name: string, data: TModelData): void {
    type === "number"
      ? setTimeout(() => {
          if (typeof data === "string") {
            this.presenter.modelData(name, parseInt(data));
          } else {
            this.presenter.modelData(name, data);
          }
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
    const options = params.options ? params.options : [];
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
    const orient = this.data.orientation === TOrient.HORIZONTAL
      ? "horizontal"
      : "vertical";
    return arg === orient
      ? `<option selected value="${arg}">${arg}</option> `
      : `<option value="${arg}">${arg}</option> `;
  }
}