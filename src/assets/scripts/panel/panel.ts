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
    data: TSettings;
    parentContainer: HTMLElement;

    panelContainer!: HTMLElement;
    listOfPanelItems!: any;

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
        this.render();
        this.setupHandlers();
        this.enable();
    }

    setupHandlers(){
        this.changePanelHandler = this.changePanel.bind(this);
    }

    enable(){
        this.panelContainer.addEventListener('change', this.changePanelHandler)
    }

    changePanel(e: Event){
        let element = e.target as HTMLInputElement;
        let name: string = element.getAttribute("name")!;
        let data = parseInt(element.value);
        this.presenter.setData({ [name]: data });
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

        //min, max, step
        if (panelInput.name === "from" || panelInput.name === "to" ){
            panelInput.min = this.data.min;
            panelInput.max = this.data.max;
            panelInput.step = this.data.step;
        }

        element.append(panelInput);
        return element;
    }

    render(){
        this.listOfPanelItems = [
            {
                name: 'min',
                value: this.data.min,
                type: 'number'
            },
            {
                name: 'max',
                value: this.data.max,
                type: 'number'
            },
            {
                name: 'step',
                value: this.data.step,
                type: 'number'
            },
            {
                name: 'from',
                value: this.data.currentFirst,
                type: 'number'
            },
            {
                name: 'to',
                value: this.data.currentSecond,
                type: 'number'
            },
            {
                name: 'vertical',
                value: (this.data.orientation === 'vertical'),
                type: 'checkbox'
            },
            {
                name: 'range',
                value: this.data.range,
                type: 'checkbox'
            },
            {
                name: 'scale',
                value: this.data.scale,
                type: 'checkbox'
            },
            {
                name: 'tooltip',
                value: this.data.tooltip,
                type: 'checkbox'
            },
        ]

        for (let item of this.listOfPanelItems){
            this.panelContainer.append(this.createPanelItem(item))
        }
    }
}

export { ConfigurationPanel }