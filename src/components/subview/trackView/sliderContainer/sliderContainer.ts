import { IView } from "mvp/view";

export default class SliderContainer {
  sliderContainer!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  init(that: IView): HTMLElement {
    const sliderContainerClass = that.settings.ifHorizontal
      ? "slider__content"
      : "slider__content_vertical";
    this.sliderContainer = document.createElement("div");
    this.sliderContainer.classList.add(sliderContainerClass);
    that.parentContainer.append(this.sliderContainer);
    return this.sliderContainer;
  }
}
