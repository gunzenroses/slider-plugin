import IObservable from './IObservable';

interface IModel {
  eventDispatcher: IObservable;
  setData(name: string, data: TModelData): void;
  getData(): TSettings;
}

export default IModel;
