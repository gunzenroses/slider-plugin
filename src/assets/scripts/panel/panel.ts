import { throttle } from "throttle-typescript";
import { IPresenter } from "../presenter"
import { TSettings } from "../types/types";

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

    minInput!: HTMLInputElement;
    maxInput!: HTMLInputElement;
    stepInput!: HTMLInputElement;
    currentFirstInput!: HTMLInputElement;
    currentSecondInput!: HTMLInputElement;
    verticalInput!: HTMLInputElement;
    rangeInput!: HTMLInputElement;
    scaleInput!: HTMLInputElement;
    tooltipInput!: HTMLInputElement;

    updateHandler!: {(name: string, value: number): void};
    // changeMinHandler!: {(): void};
    // changeMaxHandler!: {(): void};
    // changeStepHandler!: {(): void};
    // changeCurrentFirstHandler!: {(): void};
    // changeCurrentSecondHandler!: {(): void};
    // changeOrientationHandler!: {(): void};
    // changeRangeHandler!: {(): void};
    // changeScaleHandler!: {(): void};
    // changeTooltipHandler!: {(): void};

    changePanelHandler!: {(event: Event): void};
    updateThumbHandler!: {(number: number): void};
    updateThumbSecondHandler!: {(number: number): void};

    constructor(containerId: string, presenter: IPresenter){
        this.parentContainer = document.getElementById(containerId)!;
        this.panelContainer = document.createElement('div');
        this.panelContainer.classList.add('panel');
        this.parentContainer.after(this.panelContainer);
        this.presenter = presenter;
        this.data = this.presenter.data;
        this.data.currentFirst = fromPercentstoValueApplyStep(this.data.currentFirst, this.data.max, this.data.min, this.data.step);
        this.data.currentSecond = fromPercentstoValueApplyStep(this.data.currentSecond, this.data.max, this.data.min, this.data.step);
        this.init();
    }

    init(){
        this.render(this.data);
        this.createChildren();
        this.setupHandlers();
        this.enable();
    }

    createChildren(){
        this.minInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="min"]');
        this.maxInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="max"]');
        this.stepInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="step"]');
        this.currentFirstInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="currentFirst"]');
        this.currentSecondInput = <HTMLInputElement>this.panelContainer.querySelector('input[name="currentSecond"]');
        // this.verticalInput = <HTMLInputElement>document.getElementsByName("vertical")[0];
        // this.rangeInput = <HTMLInputElement>document.getElementsByName("range")[0];
        // this.scaleInput = <HTMLInputElement>document.getElementsByName("scale")[0];
        // this.tooltipInput = <HTMLInputElement>document.getElementsByName("tooltip")[0];
    }

    setupHandlers(){
        this.changePanelHandler = this.changePanel.bind(this);
        // this.changeMinHandler = this.changeMin.bind(this);
        // this.changeMaxHandler = this.changeMax.bind(this);
        // this.changeStepHandler = this.changeStep.bind(this);
        // this.changeCurrentFirstHandler = this.changeCurrentFirst.bind(this);;
        // this.changeCurrentSecondHandler = this.changeCurrentSecond.bind(this);
        // this.changeOrientationHandler = this.changeOrientation.bind(this);
        // this.changeRangeHandler = this.changeRange.bind(this);
        // this.changeScaleHandler = this.changeScale.bind(this);
        // this.changeTooltipHandler = this.changeTooltip.bind(this);

        this.updateHandler = this.updatePanel.bind(this);
        this.updateThumbHandler = this.updateThumb.bind(this);
        this.updateThumbSecondHandler = this.updateThumbSecond.bind(this);
    }

    enable(){
        this.panelContainer.addEventListener('change', throttle(this.changePanelHandler, 300));
        // this.minInput.addEventListener('change', this.changeMinHandler);
        // this.maxInput.addEventListener('change', this.changeMaxHandler);
        // this.stepInput.addEventListener('change', this.changeStepHandler);
        // this.currentFirstInput.addEventListener('change', this.changeCurrentFirstHandler);
        // this.currentSecondInput.addEventListener('change', this.changeCurrentSecondHandler);
        // this.verticalInput.addEventListener('change', this.changeOrientationHandler);
        // this.rangeInput.addEventListener('change', this.changeRangeHandler);
        // this.scaleInput.addEventListener('change', this.changeScaleHandler);
        // this.tooltipInput.addEventListener('change', this.changeTooltipHandler);
    
        this.presenter.fromPresenterUpdate.add(this.updateHandler);
        this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler);
        this.presenter.fromPresenterThumbSecondUpdate.add(this.updateThumbSecondHandler);
    }

    updateThumb(value: number){
        this.currentSecondInput.min = value.toString();
        this.currentFirstInput.value = value.toString();
    }

    updateThumbSecond(value: number){
        this.currentFirstInput.max = value.toString();
        this.currentSecondInput.value = value.toString();
    }

    changePanel(e: Event){
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

    // changeMin(){
    //     let data = parseInt(this.minInput.value);
    //     this.presenter.setData({min: data});
    // }

    // changeMax(){
    //     let data = parseInt(this.maxInput.value);
    //     this.presenter.setData({max: data});
    // }

    // changeStep(){
    //     let data = parseInt(this.stepInput.value);
    //     this.presenter.setData({step: data});
    // }

    // changeCurrentFirst(){
    //     let data = parseInt(this.currentFirstInput.value);
    //     this.presenter.view.selectObject = this.presenter.view.sliderThumb!;
    //     this.presenter.changeThumbs(data);
    // }

    // changeCurrentSecond(){
    //     let data = parseInt(this.currentSecondInput.value);
    //     this.presenter.view.selectObject = this.presenter.view.sliderThumbSecond!;
    //     this.presenter.changeThumbs(data);
    // }

    // changeOrientation(){
    //     let data = (this.verticalInput.checked)
    //         ? "vertical"
    //         : "horizontal"
    //     this.presenter.setData({orientation: data});
    // }

    // changeRange(){
    //     let data = (this.rangeInput.checked)
    //         ? true
    //         : false;
    //     this.presenter.setData({range: data});
    // }

    // changeScale(){
    //     let data = (this.scaleInput.checked)
    //         ? true
    //         : false;
    //     this.presenter.setData({scale: data});
    // }

    // changeTooltip(){
    //     let data = (this.tooltipInput.checked)
    //         ? true
    //         : false;
    //     this.presenter.setData({tooltip: data});
    // }

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
                value: data.range,
                type: 'checkbox'
            },
            {
                name: 'scale',
                text: 'scale',
                value: data.scale,
                type: 'checkbox'
            },
            {
                name: 'tooltip',
                text: 'tooltip',
                value: data.tooltip,
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
                case 'checkbox': panelControl = `<input class="panel__input" name= ${params.name} type= ${params.type} checked= ${params.value} ${panelControlAttr} />`; 
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