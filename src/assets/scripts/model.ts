import { TSettings } from "./types/types"
import { ISender, EventDispatcher } from './eventDispatcher'

interface IModel extends ISender {
    setData(newData: TSettings): void;
    getData(): TSettings;
    getContainerId(): string;
    changeThumb(newData: number): void;
    changeThumbSecond(newData: number): void;
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

    changeThumb(newThumbValue: number) {
        this.data.currentFirst = newThumbValue;
        this.notify(newThumbValue);
    }

    changeThumbSecond(newThumbValue: number) {
        this.data.currentSecond = newThumbValue;
        this.notify(newThumbValue);
    }
}

export { IModel, SliderModel }