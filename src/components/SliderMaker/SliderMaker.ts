import { boundMethod } from 'autobind-decorator';

import initialData from 'scripts/initialData';
import IPresenter from 'Interfaces/IPresenter';
import IModel from 'Interfaces/IModel';
import IPanel from 'Interfaces/IPanel';
import Observable from 'Observable/Observable';
import Presenter from 'Presenter/Presenter';
import Panel from 'Panel/Panel';

import 'assets/styles/slider.scss';

class SliderMaker extends Observable<TSMObservable> {
  private presenter!: IPresenter;

  private panel!: IPanel;

  private model!: IModel;

  private data!: TSettings;

  constructor(
    container: HTMLElement,
    ifPanel = false,
    options?: TSettings
  ) {
    super();
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

  subscribe<K extends keyof TSMObservable>(name: K, method: TListener<TSMObservable[K]>): SliderMaker {
    this.addListener(name, method);
    return this;
  }

  unsubscribe<K extends keyof TSMObservable>(name: K, method: TListener<TSMObservable[K]>): SliderMaker {
    if (method) {
      this.deleteListener(name, method);
    }
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
    this.makeData(container, options);
    this.presenter = new Presenter(container, this.data);
    this.panel = new Panel(container, this.presenter);
    this.model = this.presenter.model;
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
    this.presenter.addListener('allDataUpdated', this.updateAll);
    this.presenter.addListener('currentFirstDataUpdated', this.thumbUpdate);
    this.presenter.addListener(
      'currentSecondDataUpdated',
      this.thumbSecondUpdate
    );
    return this;
  }

  private makeData(container: HTMLElement, options?: TSettings): void {
    const data = { ...container.dataset, ...options };
    const dataArr: TArrayOfEntries = [];
    Object.entries(data).forEach((entry, _) => {
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
        dataArr.push([key, parseFloat(value)]);
      } else if (!undefinedValue && !panelKey) {
        dataArr.push([key, value]);
      }
    });
    const newData = Object.fromEntries(dataArr);
    this.data = { ...initialData, ...newData };
  }

  @boundMethod
  private updateAll(data: TSettings): void {
    this.notifyListener('allDataUpdated', data);
  }

  @boundMethod
  private thumbUpdate(value: number): void {
    this.notifyListener('updateThumb', value);
  }

  @boundMethod
  private thumbSecondUpdate(value: number): void {
    this.notifyListener('updateThumbSecond', value);
  }
}

export default SliderMaker;
