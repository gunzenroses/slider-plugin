import { boundMethod } from 'autobind-decorator';

import initialData from 'scripts/initialData';
import IObservable from 'Interfaces/IObservable';
import IPresenter from 'Interfaces/IPresenter';
import IModel from 'Interfaces/IModel';
import IPanel from 'Interfaces/IPanel';
import Observable from 'Observable/Observable';
import Presenter from 'Presenter/Presenter';
import Panel from 'Panel/Panel';

import 'assets/styles/slider.scss';

class SliderMaker {
  private presenter!: IPresenter;

  private panel!: IPanel;

  private model!: IModel;

  eventDispatcher!: IObservable;

  constructor(
    container: HTMLElement,
    ifPanel = false,
    options?: TSettings
  ) {
    this.init(container, ifPanel, options);
  }

  getOptions(name?: TModelData): string | TSettings {
    const newData = this.model.getData();
    if (name) {
      Object.entries(newData).forEach((entry) => {
        if (entry[0] === name) {
          return `${ entry[0] }: ${ entry[1] }`;
        }
        return 'this option does not exist';
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

  subscribe(name: string, method: any): SliderMaker {
    this.eventDispatcher.add(name, method);
    return this;
  }

  unsubscribe(name: string, method?: any): SliderMaker {
    this.eventDispatcher.delete(name, method);
    return this;
  }

  private init(
    container: HTMLElement,
    ifPanel: boolean,
    options?: TSettings
  ): SliderMaker {
    this.makeSlider(container, ifPanel, options);
    this.enable();
    return this;
  }

  private makeSlider(
    container: HTMLElement,
    ifPanel: boolean,
    options?: TSettings
  ): SliderMaker {
    const data = this.makeData(container, options);
    this.presenter = new Presenter(container, data);
    this.panel = new Panel(container, this.presenter);
    this.model = this.presenter.model;
    this.eventDispatcher = new Observable();
    if (container.dataset.panel === 'true') {
      this.changePanel(true);
    } else this.changePanel(ifPanel);
    return this;
  }

  private changePanel(ifPanel: boolean): void {
    if (ifPanel) {
      this.showPanel();
    } else {
      this.hidePanel();
    }
  }

  private enable(): SliderMaker {
    this.presenter.eventDispatcher.add('updateAll', this.updateAll);
    this.presenter.eventDispatcher.add('thumbUpdate', this.thumbUpdate);
    this.presenter.eventDispatcher.add(
      'thumbSecondUpdate',
      this.thumbSecondUpdate
    );
    return this;
  }

  private makeData(container: HTMLElement, options?: TSettings): TSettings {
    const data = { ...container.dataset, ...options };
    const dataArr: TArrayOfEntries = [];
    Object.entries(data).map((entry, index) => {
      const key = entry[0];
      const value = entry[1];
      const undefinedValue = typeof value === 'undefined';
      const panelKey = key === 'panel';
      const keyOfNumValue = key === 'min'
        || key === 'max'
        || key === 'step'
        || key === 'currentFirst'
        || key === 'currentSecond';
      const valueTypeString = typeof value === 'string';
      if (keyOfNumValue && valueTypeString) {
        dataArr[index] = [key, parseFloat(value)];
      } else if (!undefinedValue && !panelKey) {
        dataArr[index] = [key, value];
      }
    });
    const newData = Object.fromEntries(dataArr);
    return { ...initialData, ...newData };
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
