import IView from "Interfaces/IView";

export default class SliderContainer {
  element!: HTMLElement;

  constructor(that: IView, container: HTMLElement) {
    this.init(that, container);
  }

  private init(that: IView, container: HTMLElement): HTMLElement {
    const sliderContainerClass = that.settings.ifHorizontal
      ? "slider__content"
      : "slider__content_vertical";
    this.element = document.createElement("div");
    this.element.classList.add(sliderContainerClass);
    container.append(this.element);
    return this.element;
  }
}
