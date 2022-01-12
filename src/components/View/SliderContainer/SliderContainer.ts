import IView from "interfaces/IView";

class SliderContainer {
  element!: HTMLElement;

  constructor(that: IView, container: HTMLElement) {
    this.init(that, container);
  }

  private init(that: IView, container: HTMLElement): HTMLElement {
    const sliderContainerClass = that.settings.ifHorizontal
      ? "js-slider__content"
      : "js-slider__content_vertical";
    this.element = document.createElement("div");
    this.element.classList.add(sliderContainerClass);
    container.append(this.element);
    return this.element;
  }
}

export default SliderContainer;
