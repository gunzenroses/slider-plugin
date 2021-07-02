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

    updateHandler!: {(name: string, value: number): void};
    changeMinHandler!: {(): void};
    changeMaxHanler!: {(): void};
    changePanelHandler!: {(event: Event): void};

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
        this.setupHandlers();
        this.enable();
    }

    setupHandlers(){
        this.changePanelHandler = this.changePanel.bind(this);
        this.updateHandler = this.updatePanel.bind(this);
    }

    enable(){
        this.panelContainer.addEventListener('change', this.changePanelHandler);
        this.presenter.fromPresenterUpdate.add(this.updateHandler);
    }

    changePanel(e: Event){
        let element = e.target as HTMLInputElement;
        let name = element.getAttribute("name")!;
        let data = parseInt(element.value);
        this.presenter.setData({ [name]: data });
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