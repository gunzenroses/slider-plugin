import { boundMethod } from 'autobind-decorator';
import Observable from 'Observable/Observable';
import Tooltip from 'View/Tooltip/Tooltip';

class Thumb extends Observable<TThumbObservable> {
  element!: HTMLElement;

  tooltip!: TTooltip;

  constructor(data: TSubviewData, modifier: string) {
    super();
    this.init(data, modifier);
  }

  @boundMethod
  change(settings: TViewSettings, modifier: string): void {
    const { ifHorizontal, currentFirst, currentSecond, firstPosition, secondPosition } = settings;
    const currentValue = modifier === 'first' ? currentFirst : currentSecond;
    const position = modifier === 'first' ? firstPosition : secondPosition;
    if (ifHorizontal) {
      this.element.style.left = `${ position }%`;
    } else {
      this.element.style.bottom = `${ position }%`;
    }
    this.tooltip.change(currentValue);
  }

  private init(data: TSubviewData, modifier: string): void {
    const { container, settings } = data;
    this.makeThumb(settings, modifier);
    this.addTooltip(settings, modifier);
    this.enable();
    container.append(this.element);
    this.change(settings, modifier);
  }

  private makeThumb(settings: TViewSettings, modifier: string): void {
    const { ifHorizontal, range } = settings;
    this.element = document.createElement('div');
    const typeClass = ifHorizontal
      ? `thumb_${ modifier }`
      : `thumb_${ modifier }-vertical`;
    const totalClass = ['thumb', typeClass]
    totalClass.forEach((item: string) => {
      this.element.classList.add(item);
    });
  }

  private addTooltip(settings: TViewSettings, modifier: string) {
    this.tooltip = new Tooltip(settings, modifier);
    this.element.append(this.tooltip.element);
  }

  private enable() {
    this.element.addEventListener('pointerdown', this.onPointerDown);
  }

  @boundMethod
  private onPointerDown(e: PointerEvent) {
    if (!e.target) return;
    e.preventDefault();
    document.addEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerdown', this.onPointerDown);
  }

  @boundMethod
  private onPointerMove(e: PointerEvent) {
    e.preventDefault();
    this.notifyListener('dragThumb', { element: this.element, event: e});
    document.addEventListener('pointerup', this.onPointerUp);
  }

  @boundMethod
  private onPointerUp(e: PointerEvent) {
    e.preventDefault();
    document.removeEventListener('pointerup', this.onPointerUp);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.element.addEventListener('pointerdown', this.onPointerDown);
  }
}

export default Thumb;
