import IView from 'Interfaces/IView';

class Track {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    const trackClass: Array<string> = that.settings.ifHorizontal
      ? ['track']
      : ['track', 'track_vertical'];
    this.element = document.createElement('div');
    trackClass.forEach((item) => this.element.classList.add(item));
    that.container.append(this.element);
    return this.element;
  }
}

export default Track;
