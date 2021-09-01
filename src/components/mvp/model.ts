import { EventDispatcher } from "./eventDispatcher";
import { IModelData, TSettings } from "utils/types";
import { applyStepOnValue } from "utils/common";
import adjustValue from "helpers/adjustValue";

interface IModel {
  fromModelChangeView: EventDispatcher;
  fromModelUpdateData: EventDispatcher;
  setData(name: string, data: IModelData): void;
  getData(): TSettings;
  getContainer(): HTMLElement;
}

class SliderModel implements IModel {
  private container: HTMLElement;
  private data: TSettings;
  fromModelChangeView: EventDispatcher;
  fromModelUpdateData: EventDispatcher;

  constructor(container: HTMLElement, settings: TSettings) {
    this.fromModelChangeView = new EventDispatcher();
    this.fromModelUpdateData = new EventDispatcher();
    this.container = container;
    this.data = settings;
    this.updateCurrentsWithStep();
  }

  private updateCurrentsWithStep(): void {
    this.data.currentFirst = applyStepOnValue(
      this.data.currentFirst,
      this.data.max,
      this.data.min,
      this.data.step
    );
    this.data.currentSecond = this.data.range
      ? applyStepOnValue(this.data.currentSecond, this.data.max, this.data.min, this.data.step)
      : this.data.max;
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  getData(): TSettings {
    return this.data;
  }

  setData(name: string, data: IModelData): void {
    name === "currentFirst"
      ? this.changeThumb(data as number)
      : name === "currentSecond"
      ? this.changeThumbSecond(data as number)
      : this.changeAll(name, data);
  }

  private changeThumb(value: number): void {
    this.data.currentFirst = applyStepOnValue(value, this.data.max, this.data.min, this.data.step);
    this.fromModelChangeView.notify(this.data.currentFirst);
  }

  private changeThumbSecond(value: number): void {
    this.data.currentSecond = applyStepOnValue(value, this.data.max, this.data.min, this.data.step);
    this.fromModelChangeView.notify(this.data.currentSecond);
  }

  private changeAll(name: string, data: IModelData): void {
    const oldData = this.getData();
    if (oldData[name] === data) return;

    data = adjustValue(name, data, oldData);
    const newData = { [name]: data };
    this.data = { ...oldData, ...newData };

    this.updateCurrentsWithStep();
    this.fromModelUpdateData.notify();
  }
}

export { IModel, SliderModel };
