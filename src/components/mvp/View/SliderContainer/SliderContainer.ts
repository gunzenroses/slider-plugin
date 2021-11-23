import { IView } from "mvp/View/View";

export default class SliderContainer {
  sliderContainer!: HTMLElement;

  constructor(that: IView, container: HTMLElement) {
    this.init(that, container);
  }

  private init(that: IView, container: HTMLElement): HTMLElement {
    const sliderContainerClass = that.settings.ifHorizontal
      ? "slider__content"
      : "slider__content_vertical";
    this.sliderContainer = document.createElement("div");
    this.sliderContainer.classList.add(sliderContainerClass);
    container.append(this.sliderContainer);
    return this.sliderContainer;
  }
}