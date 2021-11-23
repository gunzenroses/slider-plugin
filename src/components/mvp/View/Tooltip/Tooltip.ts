import { IView } from "mvp/View/View";
import ISubview from "Interfaces/ISubview";
import { percentsToValue } from "Utils/common";

export default class Tooltip implements ISubview {
  private className: string;
  private parentNode!: HTMLElement;
  element!: HTMLElement;

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.createChildren(that);
    this.make(that);
    this.change(that);
    this.append();
    return this.element;
  }

  private createChildren(that: IView): void {
    this.parentNode =
      this.className === "tooltip_first" ? that.thumb.element : that.thumbSecond.element;
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

  change(that: IView): HTMLElement {
    const value =
      this.className === "tooltip_first"
        ? that.settings.firstPosition
        : that.settings.secondPosition;
    this.element.innerText = percentsToValue(value, that.settings);
    return this.element;
  }

  private append(): void {
    this.parentNode.append(this.element);
  }
}