import IView from 'Interfaces/IView';

class Track {
  element!: HTMLElement;

  constructor(container: DocumentFragment, that: IView) {
    this.init(container, that);
  }

  private init(container: DocumentFragment, that: IView): HTMLElement {
    const trackClass: Array<string> = that.settings.ifHorizontal
      ? ['track']
      : ['track', 'track_vertical'];
    this.element = document.createElement('div');
    trackClass.forEach((item) => this.element.classList.add(item));
    container.append(this.element);
    return this.element;
  }
}

export default Track;
