import IObservable from './IObservable';

interface IView {
  eventDispatcher: IObservable;
  settings: TViewSettings;
  parentContainer: HTMLElement;
  thumb: HTMLElement;
  thumbSecond: HTMLElement;
  track: HTMLElement;
  range: HTMLElement;
  scale: HTMLElement;
  thumbWidth: number;
  containerSize: number;

  init(settings: TSettings): void;
  enable(): void;
  selectThumb(e: PointerEvent): void;
  dragThumbStart(e: PointerEvent): void;
  dragThumbMove(e: PointerEvent): void;
  dragThumbEnd(): void;
  changeThumb(name: string, val: number): void;
}

export default IView;
