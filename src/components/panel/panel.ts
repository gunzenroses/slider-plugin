import { throttle } from "throttle-typescript";
import { IPresenter } from "../mvp/presenter"
import { TSettings } from "../../scripts/types/types";
import { checkValidity } from "./checkValidity";

interface IPanel {
    presenter: IPresenter;
    parentContainer: HTMLElement;
    data: TSettings;
    init(): void;
    render(data: TSettings): void;
    changePanel(event: Event): void;
    updatePanel(): void;
    updateThumb(): void;
    updateThumbSecond(): void;
    validation: checkValidity;
} 

class ConfigurationPanel implements IPanel {
    presenter: IPresenter;
    parentContainer: HTMLElement;
    data!: TSettings;

    panelContainer: HTMLElement;
    panelItems: HTMLElement;
    private listOfPanelItems!: any;

    checkboxes!: NodeListOf<HTMLElement>;
    minInput!: HTMLInputElement;
    maxInput!: HTMLInputElement;
    stepInput!: HTMLInputElement;
    currentFirstInput!: HTMLInputElement;
    currentSecondInput!: HTMLInputElement;
    orientationInput!: HTMLInputElement;
    numberInputs!: NodeListOf<Element>;
    validation!: checkValidity;

    updateHandler!: {(data: TSettings): void};
    changePanelHandler!: {(event: Event): void};
    updateThumbHandler!: {(number: number): void};
    updateThumbSecondHandler!: {(number: number): void};

    constructor(containerId: string, presenter: IPresenter){
        this.parentContainer = document.getElementById(containerId)!;
        
        this.panelContainer = document.createElement('div');
        this.panelContainer.classList.add('panel');
        this.parentContainer.after(this.panelContainer);
        
        this.panelItems = document.createElement('div');
        this.panelItems.classList.add('panel__items');
        this.panelContainer.prepend(this.panelItems);
        
        this.presenter = presenter;
        this.getData();
        this.init();
    }

    private getData(){
        this.data = this.presenter.data;
    }

    init(){
        this.render(this.data);
        this.createChildren();
        this.setupHandlers();
        this.enable();
    }

    private createChildren(){
        this.checkboxes = this.panelContainer.querySelectorAll("input[type='checkbox']");
        this.orientationInput = <HTMLInputElement>this.panelContainer.querySelector('select[name="orientation"]');
        this.numberInputs = this.panelContainer.querySelectorAll("input[type='number']")

        this.minInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="min"]');
        this.maxInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="max"]');
        this.stepInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="step"]');
        this.currentFirstInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="currentFirst"]');
        this.currentSecondInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="currentSecond"]');
        if (!this.data.range){ this.currentSecondInput.disabled = true};
    }

    private setupHandlers(){
        this.changePanelHandler = this.changePanel.bind(this);
        this.updateHandler = this.updatePanel.bind(this);
        this.updateThumbHandler = this.updateThumb.bind(this);
        this.updateThumbSecondHandler = this.updateThumbSecond.bind(this);
    }

    private enable(){
        for (let item of this.checkboxes){
            item.addEventListener('change', throttle(this.changePanelHandler, 300))
        };
        this.orientationInput.addEventListener('change', throttle(this.changePanelHandler, 300));
        for (let item of this.numberInputs){
            item.addEventListener('change', throttle(this.changePanelHandler, 300))
        };

        this.presenter.fromPresenterUpdate.add(this.updateHandler);
        this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler);
        this.presenter.fromPresenterThumbSecondUpdate.add(this.updateThumbSecondHandler);
    }

    updatePanel(){
        this.getData();
        this.minInput.value = this.data.min;
        this.maxInput.value = this.data.max;
        this.updateStep();
        this.updateThumb();
        this.updateThumbSecond();
    }

    updateThumb(){
        this.currentFirstInput.value = this.data.currentFirst;
        this.currentFirstInput.min = this.data.min;
        this.currentFirstInput.max = this.data.currentSecond;
        this.currentFirstInput.step = this.data.step;
    }

    updateThumbSecond(){
        this.currentSecondInput.min = this.data.currentFirst;
        this.currentSecondInput.max = this.data.max;
        this.currentSecondInput.value = this.data.currentSecond;
        this.currentSecondInput.step = this.data.step;
        (this.data.range)
            ? this.currentSecondInput.disabled = false
            : this.currentSecondInput.disabled = true;
    }
    
    private updateStep(){
        this.stepInput.value = this.data.step;
        this.stepInput.max = (this.data.max - this.data.min).toString();
    }

    changePanel(e: Event){
        let element = e.target as HTMLInputElement;
        let name: string = element.getAttribute("name")!;
        let type = element.getAttribute("type");
        let data = (type === "checkbox")
            ? element.checked
                : (type === "number")
                    ? parseInt(element.value)
                    : element.value;
        if (name === "currentFirst"){ this.presenter.view.selectObject = this.presenter.view.sliderThumb!; }
        if (name === "currentSecond"){ this.presenter.view.selectObject = this.presenter.view.sliderThumbSecond!; }
        if (type === "number"){
            this.validation = new checkValidity(element, this.panelContainer);
            setTimeout(()=>{ this.presenter.setData(name, data); });
        } else { this.presenter.setData(name, data); };
    }

    render(data: TSettings){
        this.panelItems.innerHTML = "";

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
            }
        ]

        for (let item of this.listOfPanelItems){
            this.panelItems.innerHTML += this.createPanelItem(item)
        }
    }

    private createPanelItem(params: any){
        //name of panelItem
        let panelItemName = `<div class= "panel__name">${params.text}</div>`

        //control (input/select/checkbox) of panelItem
        let panelControlAttr;
            switch (params.name){
                case "currentFirst": panelControlAttr = `min= "${this.data.min}" step= "${this.data.step}" max= "${this.data.currentSecond}"`;
                        break;
                case "currentSecond": panelControlAttr = `min= "${this.data.currentFirst}" step= "${this.data.step}" max= "${this.data.max}"`;
                        break;
                case "max": panelControlAttr = `min= "${this.data.min + this.data.step}"`;
                        break;
                case "min": panelControlAttr = `min= "0" max="${this.data.max - this.data.step}"`;
                        break;
                case "step": panelControlAttr = `min= "1" max="${this.data.max - this.data.min}"`;
                        break;
                default: panelControlAttr = "";
                        break;
            }

        let panelControl;
            switch (params.type){
                case 'number': panelControl = `<input class="panel__input" name= ${params.name} type= ${params.type} value= ${params.value} ${panelControlAttr} required/>`;
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

    private selectOption(arg: string){
        let selectOption = (arg === this.data.orientation)
            ? `<option selected value="${arg}">${arg}</option> `
            : `<option value="${arg}">${arg}</option> `
        return selectOption;
    }
}

export { ConfigurationPanel }