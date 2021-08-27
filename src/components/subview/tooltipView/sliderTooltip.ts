import { IView } from "mvp/view";
import { fromPercentsToValue } from "utils/common";

export default class SliderTooltip {
  className: string;
  tooltip!: HTMLElement;
  parentNode!: HTMLElement;
  value!: number;

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  init(that: IView): HTMLElement {
    this.createChildren(that);
    this.make(that);
    this.change(that);
    this.append();
    return this.tooltip;
  }

  createChildren(that: IView): void {
    this.parentNode =
      this.className === "tooltip_first" ? that.sliderThumb : that.sliderThumbSecond;
    this.value =
      this.className === "tooltip_first"
        ? that.currentFirstInPercents
        : that.currentSecondInPercents;
  }

  make(that: IView): void {
    const verticalClass = that.ifHorizontal ? "tooltip_horizontal" : "tooltip_vertical";
    const totalClass = that.ifTooltip
      ? [this.className, verticalClass]
      : [this.className, verticalClass, "disabled"];
    this.tooltip = document.createElement("span");
    this.tooltip.classList.add(...totalClass);
    this.tooltip.dataset.name = "tooltip";
  }

  change(that: IView): void {
    this.tooltip.innerText = fromPercentsToValue(this.value, that.maxValue, that.minValue);
  }

  append(): void {
    this.parentNode.append(this.tooltip);
  }
}
