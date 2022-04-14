import { boundMethod } from 'autobind-decorator';

import { changePercentsToValue } from 'utils/common';
import IPresenter from 'Interfaces/IPresenter';
import IModel from 'Interfaces/IModel';
import IView from 'Interfaces/IView';
import Observable from 'Observable/Observable';
import Model from 'Model/Model';
import View from 'View/View';

class Presenter extends Observable implements IPresenter {

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
    this.view.addListener('firstThumb', this.modelThumbFirst);
    this.view.addListener('secondThumb', this.modelThumbSecond);
    this.model.addListener('thumbUpdate', this.changeFirstThumb);
    this.model.addListener(
      'thumbSecondUpdate',
      this.changeSecondThumb
    );
    this.model.addListener('updateData', this.updateData);
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
    this.notifyListener('updateAll');
  }

  @boundMethod
  private changeFirstThumb(value: number): void {
    this.notifyListener('thumbUpdate', value);
    this.view.changeThumb('thumbFirst', value);
  }

  @boundMethod
  private changeSecondThumb(value: number): void {
    this.notifyListener('thumbSecondUpdate', value);
    this.view.changeThumb('thumbSecond', value);
  }
}

export default Presenter;
