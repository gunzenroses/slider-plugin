import { IModelData, TSettings } from "Utils/types";
import { applyStepOnValue } from "Utils/common";
import adjustValue from "Helpers/adjustValue";
import Observable from "mvp/Observable/Observable";
import IObservable from "Interfaces/IObservable";
import IModel from "Interfaces/IModel";

export default class Model implements IModel {
  private data: TSettings;
  fromModelChangeView: IObservable;
  fromModelUpdateData: IObservable;

  constructor(settings: TSettings) {
    this.fromModelChangeView = new Observable();
    this.fromModelUpdateData = new Observable();
    this.data = settings;
    this.updateCurrentsWithStep();
  }

  private updateCurrentsWithStep(): void {
    this.data.currentFirst = applyStepOnValue(this.data.currentFirst, this.data);
    this.data.currentSecond = this.data.range
      ? applyStepOnValue(this.data.currentSecond, this.data)
      : this.data.max;
  }

  getData(): TSettings {
    return this.data;
  }

  setData(name: string, data: IModelData): void {
    this.updateData(name, data);
    this.updateCurrentsWithStep();
    this.changeData(name);
  }

  private updateData(name: string, data: IModelData): void {
    const oldData = this.getData();
    if (oldData[name] === data) return;
    data = adjustValue(name, data, oldData);
    const newData = { [name]: data };
    this.data = { ...oldData, ...newData };
  }

  private changeData(name: string): void {
    name === "currentFirst"
      ? this.fromModelChangeView.notify(this.data.currentFirst)
      : name === "currentSecond"
      ? this.fromModelChangeView.notify(this.data.currentSecond)
      : this.fromModelUpdateData.notify();
  }
}
