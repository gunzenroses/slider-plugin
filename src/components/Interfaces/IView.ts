import IObservable from './IObservable';

interface IView extends IObservable {
  settings: TViewSettings;
  container: HTMLElement;
  track: HTMLElement;
  scale: HTMLElement;
  range: TRange;
  thumbs: TThumbs;
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
