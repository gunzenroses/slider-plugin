import Thumb from 'View/Thumb/Thumb';
import IObservable from './IObservable';

interface IView extends IObservable<TViewObservable> {
  settings: TViewSettings;
  container: HTMLElement;
  track: HTMLElement;
  scale: HTMLElement;
  range: TRange;
  thumbFirst: Thumb;
  thumbSecond: Thumb;
  thumbWidth: number;
  containerSize: number;

  init(settings: TSettings): void;
  enable(): void;
  selectThumb(e: PointerEvent): void;
  dragThumb(e: PointerEvent): void;
  changeThumb(name: string, val: number): void;
}

export default IView;
