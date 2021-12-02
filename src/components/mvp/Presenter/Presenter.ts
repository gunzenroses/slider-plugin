 import { TModelData, TSettings } from "Utils/types";
import {
  changePercentsToValue,
} from "Utils/common";
import IModel from "Interfaces/IModel";
import IObservable from "Interfaces/IObservable";
import IPresenter from "Interfaces/IPresenter";
import IView from "Interfaces/IView";
import Model from "../Model/Model";
import Observable from "../Observable/Observable";
import View from "../View/View";

export default class Presenter implements IPresenter {
  model: IModel;
  view: IView;
  eventDispatcher: IObservable;
  data!: TSettings;

  changeViewHandler!: { (value: number): void };
  updateDataHandler!: { (data: TSettings): void };
  modelThumbFirstHandler!: (value: number) => void;
  modelThumbSecondHandler!: (value: number) => void;
  changeSecondThumbHandler!: (value: number) => void;
  changeFirstThumbHandler!: (value: number) => void;

  constructor(container: HTMLElement, data: TSettings) {
    this.model = new Model(data);
    this.view = new View(container);
    this.eventDispatcher = new Observable();
    this.init();
  }

  init(): void {
    this.updateView();
    this.setupHandlers();
    this.enable();
  }

  updateView(): void {
    this.data = this.model.getData();
    this.view.init(this.data);
  }

  private setupHandlers(): void {
    this.changeFirstThumbHandler = this.changeFirstThumb.bind(this);
    this.changeSecondThumbHandler = this.changeSecondThumb.bind(this);
    this.updateDataHandler = this.updateData.bind(this);
    this.modelThumbFirstHandler = this.modelThumbFirst.bind(this);
    this.modelThumbSecondHandler = this.modelThumbSecond.bind(this);
  }

  private enable(): void {
    this.view.eventDispatcher.add("firstThumb", this.modelThumbFirstHandler);
    this.view.eventDispatcher.add("secondThumb", this.modelThumbSecondHandler);
    this.model.eventDispatcher.add("changeFirstThumb", this.changeFirstThumbHandler);
    this.model.eventDispatcher.add("changeSecondThumb", this.changeSecondThumbHandler);
    this.model.eventDispatcher.add("updateData", this.updateDataHandler);
  }

  //value - %, newValue - actual
  private modelThumbFirst(value: number): void {
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData("currentFirst", newValue);
  }

  //value - %, newValue - actual
  private modelThumbSecond(value: number): void {
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData("currentSecond", newValue);
  }

  //to update all kinds of data
  modelData(name: keyof TSettings, data: TModelData): void {
    this.model.setData(name, data);
  }

  private updateData(): void {
    this.updateView();
    this.eventDispatcher.notify("updateAll");
  }

  //value - actual
  private changeFirstThumb(value: number): void {
    this.eventDispatcher.notify("thumbUpdate", value);
    this.view.changeFirstThumb(value);
  }
  
  //value - actual
  private changeSecondThumb(value: number): void {
    this.eventDispatcher.notify("thumbSecondUpdate", value);
    this.view.changeSecondThumb(value);
  }
}

export { IPresenter, Presenter };
