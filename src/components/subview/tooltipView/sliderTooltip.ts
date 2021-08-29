import { IView } from "mvp/view";
import ISubview from "subview/subviewElement";
import { fromPercentsToValue } from "utils/common";

export default class SliderTooltip implements ISubview {
  className: string;
  element!: HTMLElement;
  parentNode!: HTMLElement;

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  init(that: IView): HTMLElement {
    this.createChildren(that);
    this.make(that);
    this.change(that);
    this.append();
    return this.element;
  }

  createChildren(that: IView): void {
    this.parentNode =
      this.className === "tooltip_first"
        ? that.sliderThumb.element
        : that.sliderThumbSecond.element;
  }

  make(that: IView): HTMLElement {
    const verticalClass = that.ifHorizontal ? "tooltip_horizontal" : "tooltip_vertical";
    const totalClass = that.ifTooltip
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
        ? that.currentFirstInPercents
        : that.currentSecondInPercents;
    this.element.innerText = fromPercentsToValue(value, that.maxValue, that.minValue);
    return this.element;
  }

  append(): void {
    this.parentNode.append(this.element);
  }
}
