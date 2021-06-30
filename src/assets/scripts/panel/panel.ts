import { EventDispatcher } from "../eventDispatcher";
import { IPresenter } from "../presenter"
import { TSettings } from "../types/types";

type listOfPanelItems = {

}

interface IPanel {
    presenter: IPresenter;
    data: TSettings;
    parentContainer: HTMLElement;

    // minPanel: {};
    // maxPanel: HTMLElement;
    // stepPanel: HTMLElement;
    // fromPanel: HTMLElement;
    // toPanel: HTMLElement;
    // verticalPanel: HTMLElement;
    // rangePanel: HTMLElement;
    // scalePanel: HTMLElement;
    // tooltipPanel: HTMLElement;

    init(): void;
    // setupHandlers(): void;
    // enable(): void;
}

class ConfigurationPanel extends EventDispatcher implements IPanel {
    presenter: IPresenter;
    data: TSettings;
    parentContainer: HTMLElement;

    panelContainer!: HTMLElement;

    listOfPanelItems: any;

    minPanel!: {};
    maxPanel!: {};
    stepPanel!: {};
    currentFirstPanel!: {};
    currentSecondPanel!: {};
    orientationPanel!: {};
    rangePanel!: {};
    scalePanel!: {};
    tooltipPanel!: {};

    constructor(containerId: string, presenter: IPresenter){
        super();
        this.parentContainer = document.getElementById(containerId)!;
        this.panelContainer = document.createElement('div');
        this.panelContainer.classList.add('panel');
        this.parentContainer.after(this.panelContainer);
        this.presenter = presenter;
        this.data = this.presenter.data;
        this.init();
    }

    init(){
        this.createChildren();
        this.setupHandlers();
        this.enable();
        this.render();
    }

    createChildren(){
        this.listOfPanelItems = [
            this.minPanel = {
                name: 'min',
                value: this.data.min,
                type: 'number'
            },
            this.maxPanel = {
                name: 'max',
                value: this.data.max,
                type: 'number'
            },
            this.stepPanel = {
                name: 'step',
                value: this.data.step,
                type: 'number'
            },
            this.currentFirstPanel = {
                name: 'from',
                value: this.data.currentFirst,
                type: 'number'
            },
            this.currentSecondPanel = {
                name: 'to',
                value: this.data.currentSecond,
                type: 'number'
            },
            this.orientationPanel = {
                name: 'horizontal',
                value: (this.data.orientation === 'horizontal'),
                type: 'checkbox'
            },
            this.rangePanel = {
                name: 'range',
                value: this.data.range,
                type: 'checkbox'
            },
            this.scalePanel = {
                name: 'scale',
                value: this.data.scale,
                type: 'checkbox'
            },
            this.tooltipPanel = {
                name: 'tooltip',
                value: this.data.tooltip,
                type: 'checkbox'
            },
        ]
    }

    setupHandlers(){

    }

    enable(){

    }

    createPanelItem(params: any){
        let element = document.createElement('div');
        element.classList.add('panel__item');
        let panelItemName = document.createElement('div');
        panelItemName.classList.add('panel__name')
        panelItemName.innerText = params.name;
        element.append(panelItemName);
        
        let panelInput = document.createElement('input');
        panelInput.classList.add("panel__input");
        panelInput.name = params.name;
        panelInput.type = params.type;
        (panelInput.type === "number")
            ? panelInput.value = params.value
            : panelInput.checked = params.value;

        element.append(panelInput);
        return element;
    }

    render(){
        for (let item of this.listOfPanelItems){
            this.panelContainer.append(this.createPanelItem(item))
        }

    //     this.minPanel = this.createPanelItem();
    //     this. maxPanel = this.createPanelItem();
    //     this.stepPanel = this.createPanelItem();
    //     this.fromPanel = this.createPanelItem();
    //     this.toPanel = this.createPanelItem();
    //     this.verticalPanel = this.createPanelItem();
    //     this.rangePanel = this.createPanelItem();
    //     this.scalePanel = this.createPanelItem();
    //     this.tooltipPanel = this.createPanelItem();

    }
}

export { ConfigurationPanel }