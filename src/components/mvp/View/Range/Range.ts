import { IView } from "mvp/View/View";
import ISubview from "Interfaces/ISubview";

//here all values are in %
export default class Range implements ISubview {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that);
    this.change(that);
    that.track.append(this.element);
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
        ? (this.element.style.left = that.settings.firstPosition + "%")
        : (this.element.style.bottom = that.settings.firstPosition + "%")
      : that.settings.ifHorizontal
      ? (this.element.style.right = 100 - that.settings.firstPosition + "%")
      : (this.element.style.top = 100 - that.settings.firstPosition + "%");
  }

  private changeSecond(that: IView): void {
    that.settings.ifHorizontal
      ? (this.element.style.right = 100 - that.settings.secondPosition + "%")
      : (this.element.style.top = 100 - that.settings.secondPosition + "%");
  }
}
