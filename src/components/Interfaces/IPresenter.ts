import IModel from './IModel';
import IObservable from './IObservable';
import IView from './IView';

interface IPresenter extends IObservable {
  model: IModel;
  view: IView;

  init(): void;
  updateView(): void;
  getData(): TSettings;
  modelData(name: string, data: TModelData): void;
}

export default IPresenter;
