import { TSettings } from "./types/types"
import { EventDispatcher } from './eventDispatcher'

interface IModel {
    fromModelChangeView: EventDispatcher;
    setData(newData: TSettings): void;
    getData(): object;
    getContainerId(): string;
    changeThumb(object: any, newData: number): void;
    changeThumbSecond(object: any, newData: number): void;
}

class SliderModel implements IModel {
    private containerId: string;
    private data: TSettings;
    fromModelChangeView: EventDispatcher;

    constructor(containerId: string, settings: TSettings){
        this.containerId = containerId
        this.data = settings
        this.fromModelChangeView = new EventDispatcher(this)
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

    // changeThumb(newThumbValue: number){
    //     this.data.currentFirst = newThumbValue;
    //     this.fromModelChangeView.notify(newThumbValue);
    // }

    // changeThumbSecond(newThumbValue: number) {
    //     this.data.currentSecond = newThumbValue;
    //     this.fromModelChangeView.notify(newThumbValue);
    // }

    changeThumb(object: any, newThumbValue: number) {
        this.data.currentFirst = newThumbValue;
        this.fromModelChangeView.notify({object, newThumbValue});
        //return this;
    }

    changeThumbSecond(object: any, newThumbValue: number) {
        this.data.currentSecond = newThumbValue;
        this.fromModelChangeView.notify({object, newThumbValue});
        // return this;
    }
}

export { IModel, SliderModel }