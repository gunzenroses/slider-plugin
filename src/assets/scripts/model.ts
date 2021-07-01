import { TSettings } from "./types/types"
import { ISender, EventDispatcher } from './eventDispatcher'
import { mergeData } from "./common"

interface IModel {
    fromModelChangeView: EventDispatcher;
    setData(flag: string, newData: TSettings): void;
    getData(): TSettings;
    getContainerId(): string;
    changeThumb(value: number): void;
    changeThumbSecond(value: number): void;
}

class SliderModel implements IModel {
    private containerId: string;
    private data: TSettings;
    fromModelChangeView: EventDispatcher;

    constructor(containerId: string, settings: TSettings){
        this.fromModelChangeView = new EventDispatcher(this)
        this.containerId = containerId
        this.data = settings
    }
    
    getContainerId(){
        return this.containerId;
    }

    setData(flag: string, newData: TSettings){
        let oldData = this.getData();
        this.data = mergeData(oldData, newData);
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