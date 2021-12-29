import { TModelData, TSettings } from "Utils/types";
import IObservable from "./IObservable";

export default interface IModel {
  eventDispatcher: IObservable;
  setData(name: string, data: TModelData): void;
  getData(): TSettings;
}
