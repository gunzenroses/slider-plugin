import { IView } from "mvp/view";
import ISubview from "subview/subviewElement";

export default class SliderThumb implements ISubview {
  element!: HTMLElement;
  className: string;

  constructor(that: IView, className: string) {
    this.className = className;
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
    const typeClass = that.ifHorizontal ? this.className : `${this.className}-vertical`;
    const totalClass =
      this.className === "thumb_first" || that.ifRange
        ? ["slider__thumb", typeClass]
        : ["slider__thumb", typeClass, "disabled"];
    totalClass.forEach((item: string) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  change(that: IView): HTMLElement {
    const num =
      this.className === "thumb_first" ? that.currentFirstInPercents : that.currentSecondInPercents;
    that.ifHorizontal
      ? (this.element.style.left = num + "%")
      : (this.element.style.bottom = num + "%");
    return this.element;
  }
}
