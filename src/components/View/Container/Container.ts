import IView from 'src/components/Interfaces/IView';

class Container {
  element!: HTMLElement;

  constructor(that: IView, container: HTMLElement) {
    this.init(that, container);
  }

  private init(that: IView, container: HTMLElement): HTMLElement {
    const containerClass: Array<string> = that.settings.ifHorizontal
      ? ['content']
      : ['content', 'content_vertical'];
    this.element = document.createElement('div');
    containerClass.forEach((item) => this.element.classList.add(item));
    container.append(this.element);
    return this.element;
  }
}

export default Container;
