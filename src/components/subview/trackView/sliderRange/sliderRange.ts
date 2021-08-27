import { IView } from "mvp/view";

//here all values are in %
export default class SliderRange {
  sliderRange!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  init(that: IView): HTMLElement {
    this.make(that);
    this.change(that);
    that.sliderTrack.append(this.sliderRange);
    return this.sliderRange;
  }

  private make(that: IView): HTMLElement {
    this.sliderRange = document.createElement("div");
    const sliderRangeClass: string = that.ifHorizontal ? "slider__range" : "slider__range_vertical";
    this.sliderRange.classList.add(`${sliderRangeClass}`);
    return this.sliderRange;
  }

  change(that: IView): HTMLElement {
    that.ifRange ? (this.changeFirst(that), this.changeSecond(that)) : this.changeFirst(that);
    return this.sliderRange;
  }

  private changeFirst(that: IView): void {
    that.ifRange
      ? that.ifHorizontal
        ? (this.sliderRange.style.left = that.currentFirstInPercents + "%")
        : (this.sliderRange.style.bottom = that.currentFirstInPercents + "%")
      : that.ifHorizontal
      ? (this.sliderRange.style.right = 100 - that.currentFirstInPercents + "%")
      : (this.sliderRange.style.top = 100 - that.currentFirstInPercents + "%");
  }

  private changeSecond(that: IView): void {
    that.ifHorizontal
      ? (this.sliderRange.style.right = 100 - that.currentSecondInPercents + "%")
      : (this.sliderRange.style.top = 100 - that.currentSecondInPercents + "%");
  }
}
