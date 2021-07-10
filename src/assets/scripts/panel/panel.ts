import { throttle } from "throttle-typescript";
import { IPresenter } from "../presenter"
import { TSettings } from "../types/types";
import { adjustCurrentFirst, adjustCurrentSecond, adjustMax, adjustMin, adjustStep } from "./adjustPanel";

interface IPanel {
    presenter: IPresenter;
    parentContainer: HTMLElement;
    data: TSettings;
    init(): void;
}

class ConfigurationPanel implements IPanel {
    presenter: IPresenter;
    parentContainer: HTMLElement;
    data!: TSettings;

    panelContainer: HTMLElement;
    listOfPanelItems!: any;

    checkboxes!: NodeListOf<HTMLElement>;
    minInput!: HTMLInputElement;
    maxInput!: HTMLInputElement;
    stepInput!: HTMLInputElement;
    currentFirstInput!: HTMLInputElement;
    currentSecondInput!: HTMLInputElement;
    orientationInput!: HTMLInputElement;
    rangeInput!: HTMLInputElement;
    scaleInput!: HTMLInputElement;
    tooltipInput!: HTMLInputElement;

    updateHandler!: {(data: TSettings): void};
    changeMinHandler!: {(): void};
    changeMaxHandler!: {(): void};
    changeStepHandler!: {(): void};
    changeCurrentFirstHandler!: {(): void};
    changeCurrentSecondHandler!: {(): void};

    changePanelHandler!: {(event: Event): void};
    updateThumbHandler!: {(number: number): void};
    updateThumbSecondHandler!: {(number: number): void};

    constructor(containerId: string, presenter: IPresenter){
        this.parentContainer = document.getElementById(containerId)!;
        this.panelContainer = document.createElement('div');
        this.panelContainer.classList.add('panel');
        this.parentContainer.after(this.panelContainer);
        this.presenter = presenter;
        this.getData();
        this.init();
    }

    getData(){
        this.data = this.presenter.data;
    }

    init(){
        this.render(this.data);
        this.createChildren();
        this.setupHandlers();
        this.enable();
    }

    createChildren(){
        this.checkboxes = this.panelContainer.querySelectorAll("input[type='checkbox']");
        this.orientationInput = <HTMLInputElement>document.querySelector('select[name="orientation"]');

        this.minInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="min"]');
        this.maxInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="max"]');
        this.stepInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="step"]');
        this.currentFirstInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="currentFirst"]');
        this.currentSecondInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="currentSecond"]');
        if (!this.data.range){ this.currentSecondInput.disabled = true};
    }

    setupHandlers(){
        this.changePanelHandler = this.changePanel.bind(this);
        this.changeMinHandler = this.changeMin.bind(this);
        this.changeMaxHandler = this.changeMax.bind(this);
        this.changeStepHandler = this.changeStep.bind(this);
        this.changeCurrentFirstHandler = this.changeCurrentFirst.bind(this);;
        this.changeCurrentSecondHandler = this.changeCurrentSecond.bind(this);

        this.updateHandler = this.updatePanel.bind(this);
        this.updateThumbHandler = this.updateThumb.bind(this);
        this.updateThumbSecondHandler = this.updateThumbSecond.bind(this);
    }

    enable(){
        for (let item of this.checkboxes){
            item.addEventListener('change', throttle(this.changePanelHandler, 300))
        };
        this.orientationInput.addEventListener('change', throttle(this.changePanelHandler, 300));
        
        // this.panelContainer.addEventListener('change', throttle(this.changePanelHandler, 300));
        this.minInput.addEventListener('change', this.changeMinHandler);
        this.maxInput.addEventListener('change', this.changeMaxHandler);
        this.stepInput.addEventListener('change', this.changeStepHandler);
        this.currentFirstInput.addEventListener('change', this.changeCurrentFirstHandler);
        this.currentSecondInput.addEventListener('change', this.changeCurrentSecondHandler);

        this.presenter.fromPresenterUpdate.add(this.updateHandler);
        this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler);
        this.presenter.fromPresenterThumbSecondUpdate.add(this.updateThumbSecondHandler);
    }

    updatePanel(){
        console.log(0)
        this.getData();
        this.updateThumb();
        this.updateThumbSecond();
    }

    updateThumb(){
        this.currentFirstInput.min = this.data.min;
        this.currentFirstInput.max = this.data.currentSecond;
        this.currentFirstInput.value = this.data.currentFirst;
        this.currentFirstInput.step = this.data.step;
    }

    updateThumbSecond(){
        this.currentSecondInput.min = this.data.currentFirst;
        this.currentSecondInput.max = this.data.max;
        this.currentSecondInput.value = this.data.currentSecond;
        this.currentSecondInput.step = this.data.step;
        //maybe that should be in 'updateRange()
        (this.data.range)
            ? this.currentSecondInput.disabled = false
            : this.currentSecondInput.disabled = true;
    }

    changePanel(e: Event){
        console.log(11)
        // if (e.target === this.currentFirstInput
        //     || e.target === this.currentSecondInput) return;
        let element = e.target as HTMLInputElement;
        let name: string = element.getAttribute("name")!;
        let type = element.getAttribute("type");
        let data = (type === "checkbox")
            ? element.checked
                : (type === "number")
                    ? parseInt(element.value)
                    : element.value;   
        this.presenter.setData(name, data);
    }

    changeMin(){
        let name = "min";
        let value = parseInt(this.minInput.value);
        let adjustedValue = adjustMin(value, this.data.max, this.data.step);
        this.minInput.value = adjustedValue.toString();
        this.presenter.setData(name, adjustedValue);
    }

    changeMax(){
        let name = "max";
        let value = parseInt(this.maxInput.value);
        let adjustedValue = adjustMax(value, this.data.min, this.data.step);
        this.maxInput.value = adjustedValue.toString();
        this.presenter.setData(name, adjustedValue);
    }

    changeStep(){
        let name = "step";
        let value = parseInt(this.stepInput.value);
        let adjustedValue = adjustStep(value, this.data.max, this.data.min);
        this.stepInput.value = adjustedValue.toString();
        this.presenter.setData(name, adjustedValue);
    }

    changeCurrentFirst(){
        let name = "currentFirst";
        let value = parseInt(this.currentFirstInput.value);
        //additional
        this.presenter.view.selectObject = this.presenter.view.sliderThumb!;
        //if (this.currentSecondInput.classList);
        let adjustedValue = adjustCurrentFirst(value, this.data.currentSecond, this.data.max, this.data.min, this.data.step);
        this.currentFirstInput.value = adjustedValue!.toString();
        this.presenter.setData(name, adjustedValue);
    }

    changeCurrentSecond(){
        console.log(this.currentSecondInput.attributes)
        let name = "currentSecond";
        let value = parseInt(this.currentSecondInput.value);
        //additional attr?
        this.presenter.view.selectObject = this.presenter.view.sliderThumbSecond!;
        //if (this.currentSecondInput.classList);
        let adjustedValue = adjustCurrentSecond(value, this.data.currentFirst, this.data.max, this.data.min, this.data.step);
        this.currentSecondInput.value = adjustedValue!.toString();
        this.presenter.setData(name, adjustedValue);
    }

    render(data: TSettings){
        this.panelContainer.innerHTML = "";
        
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
                value: (data.range)
                    ? "checked"
                    : "",
                type: 'checkbox'
            },
            {
                name: 'scale',
                text: 'scale',
                value: (data.scale)
                        ? "checked"
                        : "",
                type: 'checkbox'
            },
            {
                name: 'tooltip',
                text: 'tooltip',
                value: (data.tooltip)
                        ? "checked"
                        : "",
                type: 'checkbox'
            },
        ]

        for (let item of this.listOfPanelItems){
            this.panelContainer.innerHTML += this.createPanelItem(item)
        }
    }

    createPanelItem(params: any){
        //name of panelItem
        let panelItemName = `<div class= "panel__name">${params.text}</div>`
        
        //control (input/select/checkbox) of panelItem
        let panelControlAttr;
            switch (params.name){
                case "currentFirst": panelControlAttr = `min= "${this.data.min}" max= "${this.data.currentSecond}" step= "${this.data.step}"`;
                        break;
                case "currentSecond": panelControlAttr = `min= "${this.data.currentFirst}" max= "${this.data.max}" step= "${this.data.step}"`;
                        break;
                default: panelControlAttr = "";
                        break;
            }

        let panelControl;
            switch (params.type){
                case 'number': panelControl = `<input class="panel__input" name= ${params.name} type= ${params.type} value= ${params.value} ${panelControlAttr} />`;
                                break;
                case 'checkbox': panelControl = `<input class="panel__input" name= ${params.name} type= ${params.type} ${params.value} ${panelControlAttr} />`; 
                                break;
                case 'select': panelControl = `<${params.type} class="panel__input" name= ${params.name}> ${params.options.map((el: string) => this.selectOption(el)).join('')} </${params.type}>`;
                                break;
                default: break;
            }

        //gathering panelItemName and panelControl
        let element = `<div class= "panel__item">${panelItemName} ${panelControl}</div>`
        return element;
    }

    selectOption(arg: string){
        let selectOption = (arg === this.data.orientation)
            ? `<option selected value="${arg}">${arg}</option> `
            : `<option value="${arg}">${arg}</option> `
        return selectOption;
    }
}

export { ConfigurationPanel }