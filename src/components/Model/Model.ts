import { applyStepOnValue } from 'utils/common';
import adjustValue from 'helpers/adjustValue';
import IObservable from 'Interfaces/IObservable';
import IModel from 'Interfaces/IModel';
import Observable from 'Observable/Observable';

class Model extends Observable implements IModel  {
  //eventDispatcher: IObservable;

  private data: TSettings;

  constructor(settings: TSettings) {
    //this.eventDispatcher = new Observable();
    super();
    this.data = settings;
    this.improveData();
    this.updateCurrentsWithStep();
  }

  getData(): TSettings {
    const requiredData = { ...this.data };
    return requiredData;
  }

  setData(name: keyof TSettings, data: TModelData): void {
    this.updateData(name, data);
    this.updateCurrentsWithStep();
    this.changeData(name);
  }

  private improveData(): void {
    const settings = this.data;
    if (settings.min > settings.max) {
      settings.min = settings.max;
    }
    if (settings.currentSecond > settings.max) {
      settings.currentSecond = settings.max;
    }
    if (settings.currentFirst < settings.min) {
      settings.currentFirst = settings.min;
    }
    if (settings.currentFirst > settings.max) {
      settings.currentFirst = settings.max;
    }
    if (settings.currentSecond < settings.currentFirst) {
      settings.currentSecond = settings.currentFirst;
    }
    this.data = settings;
  }

  private updateData(name: keyof TSettings, data: TModelData): void {
    const oldData = this.getData();
    if (oldData[name] === data) return;
    const updData = adjustValue({
      name,
      value: data,
      data: oldData
    });
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
    if (name === 'currentFirst') {
      this.notifyListener('thumbUpdate', this.data.currentFirst);
    } else if (name === 'currentSecond') {
      this.notifyListener('thumbSecondUpdate', this.data.currentSecond);
    } else {
      this.notifyListener('updateData');
    }
  }
}

export default Model;
