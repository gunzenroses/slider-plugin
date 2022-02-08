import IObservable from './IObservable';

interface IView {
  eventDispatcher: IObservable;
  settings: TViewSettings;
  container: HTMLElement;
  thumb: HTMLElement;
  thumbSecond: HTMLElement;
  track: HTMLElement;
  range: HTMLElement;
  scale: HTMLElement;
  tooltipFirst: HTMLElement;
  tooltipSecond: HTMLElement;
  thumbWidth: number;
  containerSize: number;

  init(settings: TSettings): void;
  enable(): void;
  selectThumb(e: PointerEvent): void;
  dragThumbStart(e: PointerEvent): void;
  dragThumbMove(e: PointerEvent): void;
  dragThumbEnd(): void;
  changeFirstThumb(val: number): void;
  changeSecondThumb(val: number): void;
}

export default IView;