import { TModelData, TSettings } from "utils/types";
import { changePercentsToValue } from "utils/common";
import IPresenter from "interfaces/IPresenter";
import IObservable from "interfaces/IObservable";
import IModel from "interfaces/IModel";
import IView from "interfaces/IView";
import Observable from "Observable/Observable";
import Model from "Model/Model";
import View from "View/View";

class Presenter implements IPresenter {
  model: IModel;
  view: IView;
  eventDispatcher: IObservable;
  data!: TSettings;

  private updateDataHandler!: { (): void };
  private modelThumbFirstHandler!: (value: number) => void;
  private modelThumbSecondHandler!: (value: number) => void;
  private changeSecondThumbHandler!: (value: number) => void;
  private changeFirstThumbHandler!: (value: number) => void;

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

  modelData(name: keyof TSettings, data: TModelData): void {
    this.model.setData(name, data);
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
    this.model.eventDispatcher.add("thumbUpdate", this.changeFirstThumbHandler);
    this.model.eventDispatcher.add("thumbSecondUpdate", this.changeSecondThumbHandler);
    this.model.eventDispatcher.add("updateData", this.updateDataHandler);
  }

  private modelThumbFirst(value: number): void {
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData("currentFirst", newValue);
  }

  private modelThumbSecond(value: number): void {
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData("currentSecond", newValue);
  }

  private updateData(): void {
    this.updateView();
    this.eventDispatcher.notify("updateAll");
  }

  private changeFirstThumb(value: number): void {
    this.eventDispatcher.notify("thumbUpdate", value);
    this.view.changeFirstThumb(value);
  }

  private changeSecondThumb(value: number): void {
    this.eventDispatcher.notify("thumbSecondUpdate", value);
    this.view.changeSecondThumb(value);
  }
}

export default Presenter;
