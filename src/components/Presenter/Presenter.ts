import { boundMethod } from 'autobind-decorator';

import { changePercentsToValue } from 'utils/common';
import IPresenter from 'Interfaces/IPresenter';
import IObservable from 'Interfaces/IObservable';
import IModel from 'Interfaces/IModel';
import IView from 'Interfaces/IView';
import Observable from 'Observable/Observable';
import Model from 'Model/Model';
import View from 'View/View';

class Presenter implements IPresenter {
  eventDispatcher: IObservable;

  model: IModel;

  view: IView;

  private data!: TSettings;

  constructor(container: HTMLElement, data: TSettings) {
    this.model = new Model(data);
    this.view = new View(container);
    this.eventDispatcher = new Observable();
    this.init();
  }

  init(): void {
    this.updateView();
    this.enable();
  }

  updateView(): void {
    this.data = this.model.getData();
    this.view.init(this.data);
  }

  getData(): TSettings {
    const requiredData = this.data;
    return requiredData;
  }

  modelData(name: keyof TSettings, data: TModelData): void {
    this.model.setData(name, data);
  }

  private enable(): void {
    this.view.eventDispatcher.add('firstThumb', this.modelThumbFirst);
    this.view.eventDispatcher.add('secondThumb', this.modelThumbSecond);
    this.model.eventDispatcher.add('thumbUpdate', this.changeFirstThumb);
    this.model.eventDispatcher.add(
      'thumbSecondUpdate',
      this.changeSecondThumb
    );
    this.model.eventDispatcher.add('updateData', this.updateData);
  }

  @boundMethod
  private modelThumbFirst(value: number): void {
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData('currentFirst', newValue);
  }

  @boundMethod
  private modelThumbSecond(value: number): void {
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData('currentSecond', newValue);
  }

  @boundMethod
  private updateData(): void {
    this.updateView();
    this.eventDispatcher.notify('updateAll');
  }

  @boundMethod
  private changeFirstThumb(value: number): void {
    this.eventDispatcher.notify('thumbUpdate', value);
    this.view.changeThumb('thumbFirst', value);
  }

  @boundMethod
  private changeSecondThumb(value: number): void {
    this.eventDispatcher.notify('thumbSecondUpdate', value);
    this.view.changeThumb('thumbSecond', value);
  }
}

export default Presenter;
