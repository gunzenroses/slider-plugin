import { TModelData, TSettings } from 'utils/types';
import IModel from './IModel';
import IObservable from './IObservable';
import IView from './IView';

interface IPresenter {
  model: IModel;
  view: IView;
  data: TSettings;
  eventDispatcher: IObservable;

  init(): void;
  modelData(name: string, data: TModelData): void;
}

export default IPresenter;
