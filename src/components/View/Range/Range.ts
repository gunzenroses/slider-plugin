import { boundMethod } from 'autobind-decorator';

class Range {
  element!: HTMLElement;

  constructor(data: TSubviewData) {
    this.init(data);
  }

  @boundMethod
  change(settings: TViewSettings): void {
    if (settings.range) {
      this.changeFirst(settings);
      this.changeSecond(settings);
    } else {
      this.changeFirst(settings);
    }
  }

  private init(data: TSubviewData): HTMLElement {
    const { container, settings } = data;
    this.make(settings);
    this.change(settings);
    container.append(this.element);
    return this.element;
  }

  private make(settings: TViewSettings): HTMLElement {
    const { ifHorizontal } = settings;
    this.element = document.createElement('div');
    const elementClass: Array<string> = ifHorizontal
      ? ['range']
      : ['range', 'range_vertical'];
    elementClass.forEach((item) => this.element.classList.add(item));
    return this.element;
  }

  private changeFirst(settings: TViewSettings): void {
    const { ifHorizontal, firstPosition, range } = settings;
    if (range) {
      const position = ifHorizontal ? 'left' : 'bottom';
      this.element.style[position] = `${ firstPosition }%`;
    } else {
      const position = ifHorizontal ? 'right' : 'top';
      this.element.style[position] = `${ 100 - firstPosition }%`;
    }
  }

  private changeSecond(settings: TViewSettings): void {
    const { ifHorizontal, secondPosition } = settings;
    if (ifHorizontal) {
      this.element.style.right = `${ 100 - secondPosition }%`;
    } else {
      this.element.style.top = `${ 100 - secondPosition }%`;
    }
  }
}

export default Range;
