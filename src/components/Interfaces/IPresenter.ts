import IModel from './IModel';
import IObservable from './IObservable';
import IView from './IView';

interface IPresenter {
  model: IModel;
  view: IView;
  eventDispatcher: IObservable;

  init(): void;
  updateView(): void;
  getData(): TSettings;
  modelData(name: string, data: TModelData): void;
}

export default IPresenter;
