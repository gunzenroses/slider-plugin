import IObservable from './IObservable';

interface IModel extends IObservable<TModelObservable> {
  setData(name: string, data: TSetData): void;
  getData(): TSettings;
}

export default IModel;
