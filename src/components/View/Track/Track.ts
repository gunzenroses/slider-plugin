import IView from "interfaces/IView";

class Track {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    const trackClass: string = that.settings.ifHorizontal
      ? "slider__track"
      : "slider__track_vertical";
    this.element = document.createElement("div");
    this.element.classList.add(trackClass);
    that.sliderContainer.append(this.element);
    return this.element;
  }
}

export default Track;
