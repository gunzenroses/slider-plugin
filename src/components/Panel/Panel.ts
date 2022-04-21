import { boundMethod } from 'autobind-decorator';

import CheckValidity from 'helpers/CheckValidity';
import {
  afterCustomElement,
  appendCustomElement
} from 'utils/common';
import TOrient from 'utils/const';
import IPresenter from 'Interfaces/IPresenter';
import IPanel from 'Interfaces/IPanel';

class ConfigurationPanel implements IPanel {
  container: HTMLElement;

  presenter: IPresenter;

  data!: TSettings;

  private panelItems: HTMLElement;

  private listOfPanelItems!: Array<TPanelParam>;

  private minInput!: HTMLInputElement;

  private maxInput!: HTMLInputElement;

  private stepInput!: HTMLInputElement;

  private currentFirstInput!: HTMLInputElement;

  private currentSecondInput!: HTMLInputElement;

  constructor(container: HTMLElement, presenter: IPresenter) {
    this.container = afterCustomElement({
      type: 'div',
      className: 'panel',
      parent: container
    });
    this.panelItems = appendCustomElement({
      type: 'div',
      className: 'panel__items',
      parent: this.container
    });
    this.presenter = presenter;
    this.init();
    this.updatePanel();
  }

  init(): void {
    this.assignData();
    this.render(this.data);
    this.createChildren();
    this.enable();
  }

  @boundMethod
  updatePanel(): void {
    this.assignData();
    this.updateMin();
    this.updateMax();
    this.updateStep();
    this.updateThumb();
    this.updateThumbSecond();
  }

  @boundMethod
  changePanel(e: Event): void {
    if (e.target === null) return;
    const element = <HTMLInputElement>e.target;
    const name = element.getAttribute('name');
    const type = element.getAttribute('type');
    const data = type === 'checkbox' ? element.checked : element.value;
    if (type === 'number') {
      this.validate(element);
    }
    if (data === null || name === null) return;
    this.modelData({ type, name, data });
  }

  render(data: TSettings): void {
    this.listOfPanelItems = [
      {
        name: 'min',
        text: 'min',
        value: data.min,
        type: 'number'
      },
      {
        name: 'max',
        text: 'max',
        value: data.max,
        type: 'number'
      },
      {
        name: 'step',
        text: 'step',
        value: data.step,
        type: 'number'
      },
      {
        name: 'currentFirst',
        text: 'from',
        value: data.currentFirst,
        type: 'number'
      },
      {
        name: 'currentSecond',
        text: 'to',
        value: data.currentSecond,
        type: 'number'
      },
      {
        name: 'orientation',
        text: 'orient',
        value: data.orientation,
        type: 'select',
        options: ['horizontal', 'vertical']
      },
      {
        name: 'range',
        text: 'range',
        value: data.range ? 'checked' : '',
        type: 'checkbox'
      },
      {
        name: 'scale',
        text: 'scale',
        value: data.scale ? 'checked' : '',
        type: 'checkbox'
      },
      {
        name: 'tooltip',
        text: 'tooltip',
        value: data.tooltip ? 'checked' : '',
        type: 'checkbox'
      }
    ];

    this.panelItems.innerHTML = '';
    this.listOfPanelItems.forEach((item) => {
      this.panelItems.innerHTML += this.createPanelItem(item);
    });
  }

  private validate(element: HTMLInputElement): void {
    const validation = new CheckValidity(element, this.container);
    validation.init();
  }

  private assignData(): void {
    this.data = this.presenter.getData();
  }

  private createChildren(): void {
    this.minInput = <HTMLInputElement>(
      this.container.querySelector('input[name = "min"]')
    );
    this.maxInput = <HTMLInputElement>(
      this.container.querySelector('input[name = "max"]')
    );
    this.stepInput = <HTMLInputElement>(
      this.container.querySelector('input[name = "step"]')
    );
    this.currentFirstInput = <HTMLInputElement>(
      this.container.querySelector('input[name = "currentFirst"]')
    );
    this.currentSecondInput = <HTMLInputElement>(
      this.container.querySelector('input[name = "currentSecond"]')
    );
    this.currentSecondInput.disabled = !this.data.range;
  }

  private enable(): void {
    this.panelItems.addEventListener('change', this.changePanel);
    this.presenter.addListener('updateAllData', this.updatePanel);
    this.presenter.addListener('currentFirstDataUpdated', this.updateThumb);
    this.presenter.addListener(
      'currentSecondDataUpdated',
      this.updateThumbSecond
    );
  }

  private updateMin(): void {
    this.minInput.value = this.data.min.toString();
    this.minInput.step = this.data.step.toString();
    this.minInput.max = this.data.max.toString();
  }

  private updateMax(): void {
    this.maxInput.value = this.data.max.toString();
    this.maxInput.step = this.data.step.toString();
    this.maxInput.min = this.data.min.toString();
  }

  private updateStep(): void {
    const minStep = '0';
    this.stepInput.value = this.data.step.toString();
    this.stepInput.min = minStep;
  }

  @boundMethod
  private updateThumb(val?: number): void {
    if (typeof val === 'number') this.data.currentFirst = val;
    this.currentFirstInput.value = this.data.currentFirst.toString();
    this.currentFirstInput.min = this.data.min.toString();
    this.currentFirstInput.max = this.data.currentSecond.toString();
    this.currentFirstInput.step = this.data.step.toString();
    this.currentSecondInput.min = this.currentFirstInput.value;
  }

  @boundMethod
  private updateThumbSecond(val?: number): void {
    if (typeof val === 'number') this.data.currentSecond = val;
    this.currentFirstInput.max = this.data.currentSecond.toString();
    this.currentSecondInput.min = this.data.currentFirst.toString();
    this.currentSecondInput.max = this.data.max.toString();
    this.currentSecondInput.step = this.data.step.toString();
    this.currentSecondInput.disabled = !this.data.range;
    this.currentSecondInput.value = this.data.range
      ? this.data.currentSecond.toString()
      : this.data.max.toString();
  }

  private modelData(options: TDataInfo): void {
    const { type, name, data } = options;
    if (type === 'number') {
      if (typeof data === 'string') {
        this.presenter.modelData(name, parseFloat(data));
      } else {
        this.presenter.modelData(name, data);
      }
    } else {
      this.presenter.modelData(name, data);
    }
  }

  private createPanelItem(params: TPanelParam): string {
    const panelItemClass = params.type === 'checkbox'
      ? 'panel__item panel__item_type_checkbox'
      : 'panel__item';
    const panelNameClass = params.type === 'checkbox'
      ? 'panel__name panel__name_type_checkbox'
      : 'panel__name';
    const panelName = `<div class = '${ 
      panelNameClass }'>${ params.text }</div>`;
    const panelItem = `<div class = '${ panelItemClass }'>
        ${ panelName } ${ this.createPanelInput(params) }
      </div>`;
    return panelItem;
  }

  private createPanelInput(params: TPanelParam): string {
    const options = params.options ? params.options : [];
    if (params.type === 'number') {
      return `
      <input 
        class = 'panel__input' 
        name = ${ params.name } 
        type = ${ params.type } 
        value = ${ params.value } required/>`;
    }
    if (params.type === 'checkbox') {
      return `
        <input 
          class = 'panel__input panel__input_type_checkbox' 
          name = ${ params.name } 
          type = ${ params.type } ${ params.value }/>`;
    }
    return `
        <${ params.type } 
          class = 'panel__input' 
          name = ${ params.name }> 
          ${ options.map((el: string) => this.selectOptions(el)).join('') } 
        </${ params.type }>`;
  }

  private selectOptions(arg: string): string {
    const orient = this.data.orientation === TOrient.HORIZONTAL
      ? 'horizontal'
      : 'vertical';
    return arg === orient
      ? `<option selected value = '${ arg }'>${ arg }</option> `
      : `<option value = '${ arg }'>${ arg }</option> `;
  }
}

export default ConfigurationPanel;
