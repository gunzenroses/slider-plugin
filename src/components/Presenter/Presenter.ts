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
  model: IModel;

  view: IView;

  eventDispatcher: IObservable;

  data!: TSettings;

  constructor(container: HTMLElement, data: TSettings) {
    this.model = new Model(data);
    this.view = new View(container);
    this.eventDispatcher = new Observable();
    this.init();
  }

  init(): void {
    this.updateView();
    this.enableModelListeners();
  }

  updateView(): void {
    this.data = this.model.getData();
    this.view.init(this.data);
    this.view.eventDispatcher.add('firstThumb', this.modelThumbFirst);
    this.view.eventDispatcher.add('secondThumb', this.modelThumbSecond);
  }

  modelData(name: keyof TSettings, data: TModelData): void {
    this.model.setData(name, data);
  }

  private enableModelListeners(): void {
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
