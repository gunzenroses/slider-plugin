import { TSettings } from "./types/types"
import { EventDispatcher } from './eventDispatcher'
import { applyStepOnValue, mergeData } from "./common"

interface IModel {
    fromModelChangeView: EventDispatcher;
    fromModelUpdateData: EventDispatcher;
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
    fromModelUpdateData: EventDispatcher;

    constructor(containerId: string, settings: TSettings){
        this.fromModelChangeView = new EventDispatcher();
        this.fromModelUpdateData = new EventDispatcher();
        this.containerId = containerId;
        this.data = settings;
        this.updateCurrentsWithStep();
    }

    getContainerId(){
        return this.containerId;
    }

    getData(){
        return this.data;
    }

    setData(name: string, data: any){
        let oldData = this.getData();
        if ((oldData[name]) === data) return;
        let newData = { [name]: data };
        this.data = mergeData(oldData, newData);
        this.updateCurrentsWithStep();
        this.fromModelUpdateData.notify(); //Object.keys(newData)[0], Object.values(newData)[0]);
    }

    updateCurrentsWithStep(){
        this.data.currentFirst = applyStepOnValue(this.data.currentFirst, this.data.max, this.data.min, this.data.step)
        this.data.currentSecond = applyStepOnValue(this.data.currentSecond, this.data.max, this.data.min, this.data.step)
    }

    //special cases for setData that changes only thumbValue
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