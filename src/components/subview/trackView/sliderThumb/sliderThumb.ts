import { IView } from "mvp/view";

export default class SliderThumb {
  sliderThumb!: HTMLElement;

  constructor(that: IView, className: string) {
    this.init(that, className);
  }

  init(that: IView, className: string): HTMLElement {
    this.make(that, className);
    this.change(that, className);
    that.sliderTrack.append(this.sliderThumb);
    return this.sliderThumb;
  }

  make(that: IView, className: string): HTMLElement {
    this.sliderThumb = document.createElement("div");
    const verticalClass = that.ifHorizontal ? "" : "-vertical";
    const totalClass =
      className === "thumb_first" || that.ifRange
        ? ["slider__thumb", `${className}${verticalClass}`]
        : ["slider__thumb", `${className}${verticalClass}`, "disabled"];
    totalClass.forEach((item: string) => {
      this.sliderThumb.classList.add(item);
    });
    return this.sliderThumb;
  }

  change(that: IView, className: string): HTMLElement {
    const num =
      className === "thumb_first" ? that.currentFirstInPercents : that.currentSecondInPercents;
    that.ifHorizontal
      ? (this.sliderThumb.style.left = num + "%")
      : (this.sliderThumb.style.bottom = num + "%");
    return this.sliderThumb;
  }
}
