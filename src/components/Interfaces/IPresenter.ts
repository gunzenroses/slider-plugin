import IModel from './IModel';
import IObservable from './IObservable';
import IView from './IView';

interface IPresenter extends IObservable<TPresenterObservable> {
  init(): void;
  getData(): TSettings;
  setData(name: string, data: TSetData): void;
}

export default IPresenter;
