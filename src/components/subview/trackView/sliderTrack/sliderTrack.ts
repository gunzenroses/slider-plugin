import { IView } from "mvp/view";

export default class SliderTrack {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    const sliderTrackClass: string = that.settings.ifHorizontal
      ? "slider__track"
      : "slider__track_vertical";
    this.element = document.createElement("div");
    this.element.classList.add(sliderTrackClass);
    that.sliderContainer.append(this.element);
    return this.element;
  }
}
