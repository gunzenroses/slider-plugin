import { boundMethod } from 'autobind-decorator';
import Tooltip from 'View/Tooltip/Tooltip';

class Thumbs {
  thumbFirst!: HTMLElement;

  thumbSecond!: HTMLElement;

  constructor(data: TSubviewData) {
    this.init(data);
  }

  @boundMethod
  change(settings: TViewSettings): void {
    this.changeFirst(settings);
    if (settings.range) {
      this.changeSecond(settings);
    }
  }

  @boundMethod
  listenPointerDown(range: boolean, method: any) {
    this.thumbFirst.addEventListener('pointerdown', method);
    if (range) {
      this.thumbSecond.addEventListener('pointerdown', method);
    }
  }

  @boundMethod
  stopListenPointerDown(range: boolean, method: any) {
    this.thumbFirst.removeEventListener('pointerdown', method);
    if (range) {
      this.thumbSecond.removeEventListener('pointerdown', method);
    }
  }

  private init(data: TSubviewData): void {
    const { container, settings } = data;
    this.thumbFirst = this.makeThumb(settings, 'first');
    container.append(this.thumbFirst);
    if (settings.range) {
      this.thumbSecond = this.makeThumb(settings, 'second');
      container.append(this.thumbSecond);
    }
    this.change(settings);
  }

  private makeThumb(settings: TViewSettings, className: string) {
    const element = this.make(settings, className);
    return element;
  }

  private make(settings: TViewSettings, className: string): HTMLElement {
    const { ifHorizontal, range } = settings;
    const element = document.createElement('div');
    const typeClass = ifHorizontal
      ? `thumb_${ className }`
      : `thumb_${ className }-vertical`;
    const totalClass = className === 'first' || range
      ? ['thumb', typeClass]
      : ['thumb', typeClass, 'thumb_disabled'];
    totalClass.forEach((item: string) => {
      element.classList.add(item);
    });
    const tooltip = this.makeTooltip(settings, className);
    element.append(tooltip.element);
    return element;
  }

  private makeTooltip(settings: TViewSettings, className: string) {
    const tooltip = new Tooltip(settings, className);
    return tooltip;
  }

  private changeFirst(settings: TViewSettings): void {
    const { ifHorizontal, firstPosition } = settings;
    if (ifHorizontal) {
      this.thumbFirst.style.left = `${ firstPosition }%`;
    } else {
      this.thumbFirst.style.bottom = `${ firstPosition }%`;
    }
  }

  private changeSecond(settings: TViewSettings): void {
    const { ifHorizontal, secondPosition } = settings;
    if (ifHorizontal) {
      this.thumbSecond.style.left = `${ secondPosition }%`;
    } else {
      this.thumbSecond.style.bottom = `${ secondPosition }%`;
    }
  }
}

export default Thumbs;
