import { boundMethod } from 'autobind-decorator';

import { changePercentsToValue } from 'utils/common';
import IPresenter from 'Interfaces/IPresenter';
import IModel from 'Interfaces/IModel';
import IView from 'Interfaces/IView';
import Observable from 'Observable/Observable';
import Model from 'Model/Model';
import View from 'View/View';

class Presenter extends Observable<TPresenterObservable> implements IPresenter {
  private model: IModel;

  private view: IView;

  constructor(container: HTMLElement, data: TSettings) {
    super();
    this.model = new Model(data);
    this.view = new View(container);
    this.init();
  }

  init(): void {
    this.view.init(this.getData());
    this.enable();
  }

  getData(): TSettings {
    return this.model.getData();
  }

  setData(name: keyof TSettings, data: TSetData): void {
    this.model.setData(name, data);
  }

  private enable(): void {
    this.view.addListener('changeFirstThumb', this.changeThumbFirst);
    this.view.addListener('changeSecondThumb', this.changeSecondThumb);
    this.model.addListener('updateCurrentFirstData', this.updateFirstThumb);
    this.model.addListener('updateCurrentSecondData', this.updateSecondThumb);
    this.model.addListener('updateAllData', this.updateData);
  }

  @boundMethod
  private changeThumbFirst(value: number): void {
    const newValue = changePercentsToValue(value, this.getData());
    this.model.setData('currentFirst', newValue);
  }

  @boundMethod
  private changeSecondThumb(value: number): void {
    const newValue = changePercentsToValue(value, this.getData());
    this.model.setData('currentSecond', newValue);
  }

  @boundMethod
  private updateData(data: TSettings): void {
    this.view.init(data);
    this.notifyListener('updateAllPositions', data);
  }

  @boundMethod
  private updateFirstThumb(value: number): void {
    this.notifyListener('updateCurrentFirstPosition', value);
    this.view.changeThumb('thumbFirst', value);
  }

  @boundMethod
  private updateSecondThumb(value: number): void {
    this.notifyListener('updateCurrentSecondPosition', value);
    this.view.changeThumb('thumbSecond', value);
  }
}

export default Presenter;
