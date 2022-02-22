import initialData from 'scripts/initialData';
import IPresenter from 'Interfaces/IPresenter';
import IModel from 'Interfaces/IModel';
import IPanel from 'Interfaces/IPanel';
import Presenter from 'Presenter/Presenter';
import Panel from 'Panel/Panel';

import 'assets/styles/slider.scss';
import { boundMethod } from 'autobind-decorator';
import IObservable from 'Interfaces/IObservable';
import Observable from 'Observable/Observable';

class SliderMaker {
  private presenter!: IPresenter;
  private panel!: IPanel;
  private model!: IModel;
  eventDispatcher!: IObservable;

  constructor(
    ifPanel: boolean = false,
    container: HTMLElement,
    options?: TSettings
  ) {
    this.init(ifPanel, container, options);
    this.enable();
  }

  init(ifPanel: boolean, container: HTMLElement, options?: TSettings) {
    const data = this.makeData(container, options);
    if (container) {
      this.presenter = new Presenter(container, data);
      this.panel = new Panel(container, this.presenter);
    }
    this.model = this.presenter.model;
    this.eventDispatcher = new Observable();
    if (!ifPanel) {
      this.panel.container.classList.add('panel_hidden');
    }
  }

  enable() {
    this.presenter.eventDispatcher.add('updateAll', this.updateAll);
    this.presenter.eventDispatcher.add('thumbUpdate', this.thumbUpdate);
    this.presenter.eventDispatcher.add(
      'thumbSecondUpdate',
      this.thumbSecondUpdate
    );
  }

  getOptions(name?: TModelData): string | TSettings {
    const newData = this.model.getData();
    if (name) {
      Object.entries(newData).forEach((entry) => {
        if (entry[0] === name) {
          return `${entry[0]}: ${entry[1]}`;
        } else {
          return 'this option does not exist';
        }
      });
    }
    return newData;
  }

  setOptions(name: string, data: TModelData): SliderMaker {
    this.presenter.modelData(name, data);
    return this;
  }

  showPanel(): SliderMaker {
    this.panel.container.classList.remove('panel_hidden');
    return this;
  }

  hidePanel(): SliderMaker {
    this.panel.container.classList.add('panel_hidden');
    return this;
  }

  subscribe(name: string, method: any) {
    this.eventDispatcher.add(name, method);
    return this;
  }

  unsubscribe(name: string, method?: any): SliderMaker {
    this.eventDispatcher.delete(name, method);
    return this;
  }

  private makeData(container: HTMLElement, options?: TSettings): TSettings {
    const data = { ...container.dataset, ... options };
    let dataArr: TArrayOfEntries = [];
    Object.entries(data).map((entry, index) => {
      const key = entry[0];
      const value = entry[1];
      const keyOfNumValue =
        key === 'min' ||
        key === 'max' ||
        key === 'step' ||
        key === 'currentFirst' ||
        key === 'currentSecond';
      const valueTypeString = typeof value === 'string';
      //const valueTypeTModelData = typeof value === 'string' || 'boolean' || 'number';
      if (keyOfNumValue && valueTypeString) {
        dataArr[index] = [key, parseFloat(value)];
      } else if (typeof value !== 'undefined') {
        dataArr[index] = [key, value];
      }
    });
    const newData = Object.fromEntries(dataArr);
    return { ... initialData, ... newData };
  }

  @boundMethod
  private updateAll(): void {
    const newData = this.getOptions;
    this.eventDispatcher.notify('updateAll', newData);
  }

  @boundMethod
  private thumbUpdate(value: number): void {
    this.eventDispatcher.notify('updateThumb', value);
  }

  @boundMethod
  private thumbSecondUpdate(value: number): void {
    this.eventDispatcher.notify('updateThumbSecond', value);
  }
}

export default SliderMaker;
