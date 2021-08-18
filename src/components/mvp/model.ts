import { TSettings } from "utils/types";
import { EventDispatcher } from "./eventDispatcher";
import { applyStepOnValue } from "utils/common";
import adjustValue from "helpers/adjustData";

interface IModel {
  fromModelChangeView: EventDispatcher;
  fromModelUpdateData: EventDispatcher;
  setData(name: string, data: any): void;
  getData(): TSettings;
  getContainerId(): string;
  changeThumb(value: number): void;
  changeThumbSecond(value: number): void;
}

class SliderModel implements IModel {
  private containerId: string;
  private data: TSettings;
  fromModelChangeView: EventDispatcher;
  fromModelUpdateData: EventDispatcher;

  constructor(containerId: string, settings: TSettings) {
    this.fromModelChangeView = new EventDispatcher();
    this.fromModelUpdateData = new EventDispatcher();
    this.containerId = containerId;
    this.data = settings;
    this.updateCurrentsWithStep();
  }

  private updateCurrentsWithStep() {
    this.data.currentFirst = applyStepOnValue(
      this.data.currentFirst,
      this.data.max,
      this.data.min,
      this.data.step
    );
    this.data.currentSecond = this.data.range
      ? applyStepOnValue(
          this.data.currentSecond,
          this.data.max,
          this.data.min,
          this.data.step
        )
      : this.data.max;
  }

  getContainerId() {
    return this.containerId;
  }

  getData() {
    return this.data;
  }

  setData(name: string, data: any) {
    let oldData = this.getData();
    if (oldData[name] === data) return;

    data = adjustValue(name, data, oldData);
    let newData = { [name]: data };
    this.data = {...oldData, ...newData};

    this.updateCurrentsWithStep();
    this.fromModelUpdateData.notify();
  }

  //special cases for setData that changes only thumbValue
  changeThumb(value: number) {
    this.data.currentFirst = value;
    this.fromModelChangeView.notify(value);
  }

  changeThumbSecond(value: number) {
    this.data.currentSecond = value;
    this.fromModelChangeView.notify(value);
  }
}

export { IModel, SliderModel };
