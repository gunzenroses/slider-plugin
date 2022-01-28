import IView from 'interfaces/IView';
import { TListener } from 'utils/types';

class Range {
  element!: HTMLElement;

  private changeHandler!: TListener;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that);
    this.setupHandlers();
    this.enable(that);
    this.change(that);
    that.track.append(this.element);
    return this.element;
  }

  private make(that: IView): HTMLElement {
    this.element = document.createElement('div');
    const elementClass: string = that.settings.ifHorizontal
      ? 'slider__range'
      : 'slider__range_vertical';
    this.element.classList.add(`${ elementClass }`);
    return this.element;
  }

  private setupHandlers(): void {
    this.changeHandler = this.change.bind(this);
  }

  private enable(that: IView): void {
    that.eventDispatcher.add('changeView', this.changeHandler);
  }

  private change(that: IView): void {
    if (that.settings.range) {
      this.changeFirst(that);
      this.changeSecond(that);
    } else {
      this.changeFirst(that);
    }
  }

  private changeFirst(that: IView): void {
    if (that.settings.range) {
      const position = that.settings.ifHorizontal ? 'left' : 'bottom';
      this.element.style[position] = `${ that.settings.firstPosition }%`;
    } else {
      const position = that.settings.ifHorizontal ? 'right' : 'top';
      this.element.style[position] = `${ 100 - that.settings.firstPosition }%`;
    }
  }

  private changeSecond(that: IView): void {
    if (that.settings.ifHorizontal) {
      this.element.style.right = `${ 100 - that.settings.secondPosition }%`;
    } else {
      this.element.style.top = `${ 100 - that.settings.secondPosition }%`;
    }
  }
}

export default Range;
