import { TSettings } from "./types/types"
import { EventDispatcher } from './eventDispatcher'
import { mergeData } from "./common"

interface IModel {
    fromModelChangeView: EventDispatcher;
    fromModelUpdateView: EventDispatcher;
    setData(name: string, data: any): void;
    getData(): TSettings;
    getContainerId(): string;
    changeThumb(value: number): void;
    changeThumbSecond(value: number): void;
}

class SliderModel implements IModel {
    private containerId: string;
    private data: TSettings;
    fromModelChangeView: EventDispatcher;
    fromModelUpdateView: EventDispatcher;

    constructor(containerId: string, settings: TSettings){
        this.fromModelChangeView = new EventDispatcher();
        this.fromModelUpdateView = new EventDispatcher();
        this.containerId = containerId;
        this.data = settings;
    }
    
    getContainerId(){
        return this.containerId;
    }

    setData(name: string, data: any){
        let oldData = this.getData();
        if ((oldData[name]) === data) return;
        let newData = { [name]: data };
        this.data = mergeData(oldData, newData);
        this.fromModelUpdateView.notify() //Object.keys(newData)[0], Object.values(newData)[0]);
    }

    getData(){
        return this.data;
    }

    changeThumb(value: number) {
        this.data.currentFirst = value;
        this.fromModelChangeView.notify(value);
    }

    changeThumbSecond(value: number) {
        this.data.currentSecond = value;
        this.fromModelChangeView.notify(value);
    }
}

export { IModel, SliderModel }