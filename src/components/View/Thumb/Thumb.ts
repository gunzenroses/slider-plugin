import { boundMethod } from 'autobind-decorator';
import IView from 'Interfaces/IView';

class Thumb {
  element!: HTMLElement;

  private className: string;

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that.settings);
    this.enable(that);
    this.change(that.settings);
    that.track.append(this.element);
    return this.element;
  }

  private enable(that: IView): void {
    that.eventDispatcher.add('changeView', this.change);
  }

  private make(settings: TViewSettings): HTMLElement {
    const { ifHorizontal, range } = settings;
    this.element = document.createElement('div');
    const typeClass = ifHorizontal
      ? this.className
      : `${ this.className }-vertical`;
    const totalClass = this.className === 'thumb_first' || range
      ? ['thumb', typeClass]
      : ['thumb', typeClass, 'thumb_disabled'];
    totalClass.forEach((item: string) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  @boundMethod
  private change(settings: TViewSettings): void {
    const { firstPosition, secondPosition, ifHorizontal } = settings;
    const num = this.className === 'thumb_first'
      ? firstPosition
      : secondPosition;
    if (ifHorizontal) {
      this.element.style.left = `${ num }%`;
    } else {
      this.element.style.bottom = `${ num }%`;
    }
  }
}

export default Thumb;
