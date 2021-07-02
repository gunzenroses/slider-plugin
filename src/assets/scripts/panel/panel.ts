import { EventDispatcher } from "../eventDispatcher";
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
    data!: TSettings;
    parentContainer: HTMLElement;

    panelContainer!: HTMLElement;
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
    changeMinHandler!: {(): void};
    changeMaxHandler!: {(): void};
    changeStepHandler!: {(): void};
    changeCurrentFirstHandler!: {(): void};
    changeCurrentSecondHandler!: {(): void};
    changeOrientationHandler!: {(): void};
    changeRangeHandler!: {(): void};
    changeScaleHandler!: {(): void};
    changeTooltipHandler!: {(): void};

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
        this.init();
    }

    init(){
        this.render(this.data);
        this.createChildren();
        this.setupHandlers();
        this.enable();
    }

    createChildren(){
        this.minInput = <HTMLInputElement>document.getElementsByName("min")[0];
        this.maxInput = <HTMLInputElement>document.getElementsByName("max")[0];
        this.stepInput = <HTMLInputElement>document.getElementsByName("step")[0];
        this.currentFirstInput = <HTMLInputElement>document.getElementsByName("currentFirst")[0];
        this.currentSecondInput = <HTMLInputElement>document.getElementsByName("currentSecond")[0];
        this.verticalInput = <HTMLInputElement>document.getElementsByName("vertical")[0];
        this.rangeInput = <HTMLInputElement>document.getElementsByName("range")[0];
        this.scaleInput = <HTMLInputElement>document.getElementsByName("scale")[0];
        this.tooltipInput = <HTMLInputElement>document.getElementsByName("tooltip")[0];
    }

    setupHandlers(){
        //this.changePanelHandler = this.changePanel.bind(this);
        this.changeMinHandler = this.changeMin.bind(this);
        this.changeMaxHandler = this.changeMax.bind(this);
        this.changeStepHandler = this.changeStep.bind(this);
        this.changeCurrentFirstHandler = this.changeCurrentFirst.bind(this);;
        this.changeCurrentSecondHandler = this.changeCurrentSecond.bind(this);
        this.changeOrientationHandler = this.changeOrientation.bind(this);
        this.changeRangeHandler = this.changeRange.bind(this);
        this.changeScaleHandler = this.changeScale.bind(this);
        this.changeTooltipHandler = this.changeTooltip.bind(this);

        this.updateHandler = this.updatePanel.bind(this);
        this.updateThumbHandler = this.updateThumb.bind(this);
        this.updateThumbSecondHandler = this.updateThumbSecond.bind(this);
    }

    enable(){
        //this.panelContainer.addEventListener('change', this.changePanelHandler);
        this.minInput.addEventListener('change', this.changeMinHandler);
        this.maxInput.addEventListener('change', this.changeMaxHandler);
        this.stepInput.addEventListener('change', this.changeStepHandler);
        this.currentFirstInput.addEventListener('change', this.changeCurrentFirstHandler);
        this.currentSecondInput.addEventListener('change', this.changeCurrentSecondHandler);
        this.verticalInput.addEventListener('change', this.changeOrientationHandler);
        this.rangeInput.addEventListener('change', this.changeRangeHandler);
        this.scaleInput.addEventListener('change', this.changeScaleHandler);
        this.tooltipInput.addEventListener('change', this.changeTooltipHandler);
    
        this.presenter.fromPresenterUpdate.add(this.updateHandler);
        this.presenter.fromPresenterThumbUpdate.add(this.updateThumbHandler);
        this.presenter.fromPresenterThumbSecondUpdate.add(this.updateThumbSecondHandler);
    }

    updateThumb(value: number){
        this.currentFirstInput.value = value.toString();
    }

    updateThumbSecond(value: number){
        this.currentSecondInput.value = value.toString();
    }

    // changePanel(e: Event){
    //     let element = e.target as HTMLInputElement;
    //     let name = element.getAttribute("name")!;
    //     let data = parseInt(element.value);
    //     this.presenter.setData({ [name]: data });
    // }

    changeMin(){
        let data = parseInt(this.minInput.value);
        this.presenter.setData({min: data});
    }

    changeMax(){
        let data = parseInt(this.maxInput.value);
        this.presenter.setData({max: data});
    }

    changeStep(){
        let data = parseInt(this.stepInput.value);
        this.presenter.setData({step: data});
    }

    changeCurrentFirst(){
        let data = parseInt(this.currentFirstInput.value);
        this.presenter.changeThumbInModel(data);
    }

    changeCurrentSecond(){
        let data = parseInt(this.currentSecondInput.value);
        this.presenter.changeThumbSecondInModel(data);
    }

    changeOrientation(){
        let data = (this.verticalInput.checked)
            ? "vertical"
            : "horizontal"
        this.presenter.setData({orientation: data});
    }

    changeRange(){
        let data = (this.rangeInput.checked)
            ? true
            : false;
        this.presenter.setData({range: data});
    }

    changeScale(){
        let data = (this.scaleInput.checked)
            ? true
            : false;
        this.presenter.setData({scale: data});
    }

    changeTooltip(){
        let data = (this.tooltipInput.checked)
            ? true
            : false;
        this.presenter.setData({tooltip: data});
    }

    createPanelItem(params: any){
        let element = document.createElement('div');
        element.classList.add('panel__item');
        let panelItemName = document.createElement('div');
        panelItemName.classList.add('panel__name')
        panelItemName.innerText = params.text;
        element.append(panelItemName);
        
        let panelInput = document.createElement('input');
        panelInput.classList.add("panel__input");
        panelInput.name = params.name;
        panelInput.type = params.type;
        (panelInput.type === "number")
            ? panelInput.value = params.value
            : panelInput.checked = params.value;

        //min, max, step
        if (panelInput.name === "currentFirst" || panelInput.name === "currentSecond" ){
            panelInput.min = this.data.min;
            panelInput.max = this.data.max;
            panelInput.step = this.data.step;
        }

        element.append(panelInput);
        return element;
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
                name: 'vertical',
                text: 'vertical',
                value: (data.orientation === 'vertical'),
                type: 'checkbox'
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
            this.panelContainer.append(this.createPanelItem(item))
        }
    }

    updatePanel(name: string, value: number){
        let element = <HTMLInputElement>this.panelContainer.querySelector(`input[name=${name}]`);
        element.value = value.toString();
    }
}

export { ConfigurationPanel }