import { IView } from "mvp/view";

export default class SliderTrack {
  sliderTrack!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  init(that: IView): HTMLElement {
    const sliderTrackClass: string = that.ifHorizontal ? "slider__track" : "slider__track_vertical";
    this.sliderTrack = document.createElement("div");
    this.sliderTrack.classList.add(sliderTrackClass);
    that.sliderContainer.append(this.sliderTrack);
    return this.sliderTrack;
  }
}
