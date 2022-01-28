import { boundMethod } from 'autobind-decorator';
import IView from 'interfaces/IView';

class Thumb {
  element!: HTMLElement;

  private className: string;

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that);
    this.enable(that);
    this.change(that);
    that.track.append(this.element);
    return this.element;
  }

  private enable(that: IView): void {
    that.eventDispatcher.add('changeView', this.change);
  }

  private make(that: IView): HTMLElement {
    this.element = document.createElement('div');
    const typeClass = that.settings.ifHorizontal
      ? this.className
      : `${ this.className }-vertical`;
    const totalClass = this.className === 'thumb_first' || that.settings.range
      ? ['thumb', typeClass]
      : ['thumb', typeClass, 'js-disabled'];
    totalClass.forEach((item: string) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  @boundMethod
  private change(that: IView): void {
    const num = this.className === 'thumb_first'
      ? that.settings.firstPosition
      : that.settings.secondPosition;
    if (that.settings.ifHorizontal) {
      this.element.style.left = `${ num }%`;
    } else {
      this.element.style.bottom = `${ num }%`;
    }
  }
}

export default Thumb;
