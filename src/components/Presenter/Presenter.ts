import { boundMethod } from 'autobind-decorator';

import { changePercentsToValue } from 'utils/common';
import IPresenter from 'Interfaces/IPresenter';
import IModel from 'Interfaces/IModel';
import IView from 'Interfaces/IView';
import Observable from 'Observable/Observable';
import Model from 'Model/Model';
import View from 'View/View';

class Presenter extends Observable<TPresenterObservable> implements IPresenter {
  model: IModel;

  view: IView;

  private data!: TSettings;

  constructor(container: HTMLElement, data: TSettings) {
    super();
    this.model = new Model(data);
    this.view = new View(container);
    this.init();
  }

  init(): void {
    this.data = this.model.getData();
    this.updateView(this.data);
    this.enable();
  }

  updateView(data: TSettings): void {
    this.view.init(data);
  }

  getData(): TSettings {
    const requiredData = this.data;
    return requiredData;
  }

  modelData(name: keyof TSettings, data: TModelData): void {
    this.model.setData(name, data);
  }

  private enable(): void {
    this.view.addListener('changeFirstThumb', this.modelThumbFirst);
    this.view.addListener('changeSecondThumb', this.modelThumbSecond);
    this.model.addListener('updateCurrentFirstData', this.changeFirstThumb);
    this.model.addListener(
      'updateCurrentSecondData',
      this.changeSecondThumb
    );
    this.model.addListener('updateAllData', this.updateData);
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
  private updateData(data: TSettings): void {
    this.data = data;
    this.updateView(this.data);
    this.notifyListener('updateAllPositions', this.data);
  }

  @boundMethod
  private changeFirstThumb(value: number): void {
    this.data.currentFirst = value;
    this.notifyListener('updateCurrentFirstPosition', this.data.currentFirst);
    this.view.changeThumb('thumbFirst', this.data.currentFirst);
  }

  @boundMethod
  private changeSecondThumb(value: number): void {
    this.data.currentSecond = value;
    this.notifyListener('updateCurrentSecondPosition', this.data.currentSecond);
    this.view.changeThumb('thumbSecond', this.data.currentSecond);
  }
}

export default Presenter;
