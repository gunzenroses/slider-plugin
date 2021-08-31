import { IView } from "mvp/view";
import ISubview from "subview/subviewElement";

//here all values are in %
export default class SliderRange implements ISubview {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  init(that: IView): HTMLElement {
    this.make(that);
    this.change(that);
    that.sliderTrack.append(this.element);
    return this.element;
  }

  make(that: IView): HTMLElement {
    this.element = document.createElement("div");
    const elementClass: string = that.settings.ifHorizontal
      ? "slider__range"
      : "slider__range_vertical";
    this.element.classList.add(`${elementClass}`);
    return this.element;
  }

  change(that: IView): HTMLElement {
    that.settings.range
      ? (this.changeFirst(that), this.changeSecond(that))
      : this.changeFirst(that);
    return this.element;
  }

  private changeFirst(that: IView): void {
    that.settings.range
      ? that.settings.ifHorizontal
        ? (this.element.style.left = that.settings.currentFirst + "%")
        : (this.element.style.bottom = that.settings.currentFirst + "%")
      : that.settings.ifHorizontal
      ? (this.element.style.right = 100 - that.settings.currentFirst + "%")
      : (this.element.style.top = 100 - that.settings.currentFirst + "%");
  }

  private changeSecond(that: IView): void {
    that.settings.ifHorizontal
      ? (this.element.style.right = 100 - that.settings.currentSecond + "%")
      : (this.element.style.top = 100 - that.settings.currentSecond + "%");
  }
}
