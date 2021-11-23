import { IModelData, TSettings } from "Utils/types";
import IObservable from "./IObservable";

export default interface IModel {
  fromModelChangeView: IObservable;
  fromModelUpdateData: IObservable;
  setData(name: string, data: IModelData): void;
  getData(): TSettings;
}