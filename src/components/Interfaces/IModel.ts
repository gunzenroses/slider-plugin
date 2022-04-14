import IObservable from './IObservable';

interface IModel extends IObservable {
  setData(name: string, data: TModelData): void;
  getData(): TSettings;
}

export default IModel;
