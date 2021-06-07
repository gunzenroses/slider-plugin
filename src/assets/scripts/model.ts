import { TSettings } from "./types/types"
import { EventDispatcher } from './eventDispatcher'

interface IModel {
    containerId: string;
    settings: TSettings;
    fromModelChangeView: EventDispatcher;
    fromPresenterChangeThumb(object: any, newThumbValue: number): object;
    fromPresenterChangeThumbRight(object: any, newThumbValue: number): object;

}

class SliderModel implements IModel {
    containerId: string;
    settings: TSettings;
    fromModelChangeView: EventDispatcher;

    constructor(containerId: string, settings: TSettings){
        this.containerId = containerId
        this.settings = settings
        this.fromModelChangeView = new EventDispatcher(this)
    }

    fromPresenterChangeThumb(object: any, newThumbValue: number): object {
        this.settings.currentFirst = newThumbValue;
        this.fromModelChangeView.notify({object, newThumbValue});
        return this;
    }

    fromPresenterChangeThumbRight(object: any, newThumbValue: number): object {
        this.settings.currentSecond = newThumbValue;
        this.fromModelChangeView.notify({object, newThumbValue});
        return this;
    }
}

export { IModel, SliderModel }