import { IModelData, TSettings } from "Utils/types";
import IObservable from "./IObservable";

export default interface IModel {
  eventDispatcher: IObservable;
  setData(name: string, data: IModelData): void;
  getData(): TSettings;
}