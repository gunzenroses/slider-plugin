import { TModelData, TSettings } from "utils/types";
import { applyStepOnValue } from "utils/common";
import adjustValue from "helpers/adjustValue";
import Observable from "Observable/Observable";
import IObservable from "interfaces/IObservable";
import IModel from "interfaces/IModel";

class Model implements IModel {
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
    const updData = adjustValue(name, data, oldData);
    const newData = { [name]: updData };
    this.data = { ...oldData, ...newData };
  }

  private updateCurrentsWithStep(): void {
    this.data.currentFirst = applyStepOnValue(
      this.data.currentFirst,
      this.data
    );
    this.data.currentSecond = this.data.range
      ? applyStepOnValue(this.data.currentSecond, this.data)
      : this.data.max;
  }

  private changeData(name: keyof TSettings): void {
    if (name === "currentFirst") {
      this.eventDispatcher.notify("thumbUpdate", this.data.currentFirst);
    } else if (name === "currentSecond") {
      this.eventDispatcher.notify("thumbSecondUpdate", this.data.currentSecond);
    } else {
      this.eventDispatcher.notify("updateData");
    }
  }
}

export default Model;
