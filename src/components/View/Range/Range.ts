import { boundMethod } from 'autobind-decorator';
import IView from 'Interfaces/IView';

class Range {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that.settings);
    this.enable(that);
    this.change(that.settings);
    that.track.append(this.element);
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

  private enable(that: IView): void {
    that.eventDispatcher.add('changeView', this.change);
  }

  @boundMethod
  private change(settings: TViewSettings): void {
    if (settings.range) {
      this.changeFirst(settings);
      this.changeSecond(settings);
    } else {
      this.changeFirst(settings);
    }
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
