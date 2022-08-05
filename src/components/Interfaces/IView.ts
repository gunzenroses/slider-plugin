import IObservable from './IObservable';

interface IView extends IObservable<TViewObservable> {
  thumbWidth: number;
  containerSize: number;

  init(settings: TSettings): void;
  changeThumb(name: string, val: number): void;
}

export default IView;
