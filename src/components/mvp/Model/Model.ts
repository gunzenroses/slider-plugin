import { TModelData, TSettings } from "Utils/types";
import { applyStepOnValue } from "Utils/common";
import adjustValue from "Helpers/adjustValue";
import Observable from "mvp/Observable/Observable";
import IObservable from "Interfaces/IObservable";
import IModel from "Interfaces/IModel";

export default class Model implements IModel {
  eventDispatcher: IObservable;
  private data: TSettings;

  constructor(settings: TSettings) {
    this.eventDispatcher = new Observable();
    this.data = settings;
    this.updateCurrentsWithStep();
  }

  getData(): TSettings {
    return this.data;
  }

  setData(name: keyof TSettings, data: TModelData): void {
    this.updateData(name, data);
    this.updateCurrentsWithStep();
    this.changeData(name);
  }

  private updateData(name: keyof TSettings, data: TModelData): void {
    const oldData = this.getData();
    if (oldData[name] === data) return;
    data = adjustValue(name, data, oldData);
    const newData = { [name]: data };
    this.data = { ...oldData, ...newData };
  }

  private updateCurrentsWithStep(): void {
    this.data.currentFirst = applyStepOnValue(this.data.currentFirst, this.data);
    this.data.currentSecond = this.data.range
      ? applyStepOnValue(this.data.currentSecond, this.data)
      : this.data.max;
  }

  private changeData(name: keyof TSettings): void {
    name === "currentFirst"
      ? this.eventDispatcher.notify("changeView", this.data.currentFirst)
      : name === "currentSecond"
      ? this.eventDispatcher.notify("changeView", this.data.currentSecond)
      : this.eventDispatcher.notify("updateData");
  }
}
