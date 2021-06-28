import { TSettings } from "./types/types"
import { ISender, EventDispatcher } from './eventDispatcher'

interface IModel extends ISender {
    setData(newData: TSettings): void;
    getData(): TSettings;
    getContainerId(): string;
    changeThumb(value: number): void;
    changeThumbSecond(value: number): void;
}

class SliderModel extends EventDispatcher implements IModel {
    private containerId: string;
    private data: TSettings;

    constructor(containerId: string, settings: TSettings){
        super()
        this.containerId = containerId
        this.data = settings
    }
    
    getContainerId(){
        return this.containerId;
    }

    setData(newData: TSettings){
        this.data = newData;
    }

    getData(){
        return this.data;
    }

    changeThumb(value: number) {
        this.data.currentFirst = value;
        this.notify(value);
    }

    changeThumbSecond(value: number) {
        this.data.currentSecond = value;
        this.notify(value);
    }
}

export { IModel, SliderModel }