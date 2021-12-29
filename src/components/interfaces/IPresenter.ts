import { TModelData, TSettings } from "Utils/types";
import IModel from "./IModel";
import IObservable from "./IObservable";
import IView from "./IView";

export default interface IPresenter {
  model: IModel;
  view: IView;
  data: TSettings;
  eventDispatcher: IObservable;

  init(): void;
  modelData(name: string, data: TModelData): void;
}
