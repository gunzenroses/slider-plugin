class Track {
  element!: HTMLElement;

  constructor(container: DocumentFragment, ifHorizontal: boolean) {
    this.init(container, ifHorizontal);
  }

  private init(
    container: DocumentFragment,
    ifHorizontal: boolean
  ): HTMLElement {
    const trackClass: Array<string> = ifHorizontal
      ? ['track']
      : ['track', 'track_vertical'];
    this.element = document.createElement('div');
    trackClass.forEach((item) => this.element.classList.add(item));
    container.append(this.element);
    return this.element;
  }
}

export default Track;
