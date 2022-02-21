import { boundMethod } from 'autobind-decorator';
import IView from 'Interfaces/IView';

class Tooltip {
  element!: HTMLElement;

  private className: string;

  private parentNode!: HTMLElement;

  constructor(that: IView, className: string) {
    this.className = className;
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.createChildren(that);
    this.make(that.settings);
    this.enable(that);
    this.change(that.settings);
    this.append();
    return this.element;
  }

  private createChildren(that: IView): void {
    this.parentNode = this.className === 'tooltip_first'
      ? that.thumb
      : that.thumbSecond;
  }

  private enable(that: IView): void {
    that.eventDispatcher.add('changeView', this.change);
  }

  private make(settings: TViewSettings): HTMLElement {
    const { ifHorizontal, tooltip } = settings;
    const verticalClass = ifHorizontal
      ? 'tooltip_horizontal'
      : 'tooltip_vertical';
    const totalClass = tooltip
      ? ['tooltip', this.className, verticalClass]
      : ['tooltip', this.className, verticalClass, 'tooltip_disabled'];
    this.element = document.createElement('span');
    totalClass.forEach((item) => {
      this.element.classList.add(item);
    });
    this.element.dataset.name = 'tooltip';
    return this.element;
  }

  @boundMethod
  private change(settings: TViewSettings): void {
    const { currentFirst, currentSecond } = settings;
    const value = this.className === 'tooltip_first'
      ? currentFirst
      : currentSecond;
    this.element.innerText = value.toString();
  }

  private append(): void {
    this.parentNode.append(this.element);
  }
}

export default Tooltip;
