import { boundMethod } from 'autobind-decorator';
import Tooltip from 'View/Tooltip/Tooltip';

class Thumb {
  element!: HTMLElement;

  private tooltip!: Tooltip;

  private className: string;

  constructor(data: TTrackElementsData, className: string) {
    this.className = className;
    this.init(data);
  }

  private init(data: TTrackElementsData): HTMLElement {
    const { container, addListener, settings } = data;
    this.make(settings);
    this.makeTooltip(settings);
    this.enable(addListener);
    this.change(settings);
    container.append(this.element);
    return this.element;
  }

  private enable(addListener: TAddListener): void {
    addListener('updateSubViews', this.change);
  }

  private make(settings: TViewSettings): HTMLElement {
    const { ifHorizontal, range } = settings;
    this.element = document.createElement('div');
    const typeClass = ifHorizontal
      ? `thumb_${ this.className }`
      : `thumb_${ this.className }-vertical`;
    const totalClass = this.className === 'first' || range
      ? ['thumb', typeClass]
      : ['thumb', typeClass, 'thumb_disabled'];
    totalClass.forEach((item: string) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  private makeTooltip(settings: TViewSettings): void {
    this.tooltip = new Tooltip(settings, this.className);
    this.element.append(this.tooltip.element);
  }

  @boundMethod
  private change(settings: TViewSettings): void {
    const { firstPosition, secondPosition, ifHorizontal } = settings;
    const num = this.className === 'first'
      ? firstPosition
      : secondPosition;
    if (ifHorizontal) {
      this.element.style.left = `${ num }%`;
    } else {
      this.element.style.bottom = `${ num }%`;
    }
    this.tooltip.change(settings);
  }
}

export default Thumb;
