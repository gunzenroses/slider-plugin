import { IView } from "mvp/View/View";
import ISubview from "Interfaces/ISubview";

export default class Tooltip implements ISubview {
  element!: HTMLElement;
  private className: string;
  private parentNode!: HTMLElement;
  private changeHandler!: { (that: IView): void };

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  make(that: IView): HTMLElement {
    const verticalClass = that.settings.ifHorizontal ? "tooltip_horizontal" : "tooltip_vertical";
    const totalClass = that.settings.tooltip
      ? [this.className, verticalClass]
      : [this.className, verticalClass, "disabled"];
    this.element = document.createElement("span");
    totalClass.forEach((item) => {
      this.element.classList.add(item);
    });
    this.element.dataset.name = "tooltip";
    return this.element;
  }

  change(that: IView): void {
    const value =
      this.className === "tooltip_first"
        ? that.settings.currentFirst
        : that.settings.currentSecond;
    this.element.innerText = value.toString();
  }

  private init(that: IView): HTMLElement {
    this.createChildren(that);
    this.make(that);
    this.setupHandlers();
    this.enable(that);
    this.change(that);
    this.append();
    return this.element;
  }
 
  private createChildren(that: IView): void {
    this.parentNode =
      this.className === "tooltip_first" ? that.thumb.element : that.thumbSecond.element;
  }

  private setupHandlers() {
    this.changeHandler = this.change.bind(this);
  }

  private enable(that: IView) {
    that.eventDispatcher.add("changeView", this.changeHandler);
  }

  private append(): void {
    this.parentNode.append(this.element);
  }
}
