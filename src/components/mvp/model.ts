import { EventDispatcher, ISender } from "./eventDispatcher";
import { IModelData, TSettings } from "utils/types";
import { applyStepOnValue } from "utils/common";
import adjustValue from "helpers/adjustValue";

interface IModel {
  fromModelChangeView: ISender;
  fromModelUpdateData: ISender;
  setData(name: string, data: IModelData): void;
  getData(): TSettings;
}

class SliderModel implements IModel {
  private data: TSettings;
  fromModelChangeView: ISender;
  fromModelUpdateData: ISender;

  constructor(settings: TSettings) {
    this.fromModelChangeView = new EventDispatcher();
    this.fromModelUpdateData = new EventDispatcher();
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

export { IModel, SliderModel };
