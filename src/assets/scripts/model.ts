import { TSettings } from "./types/types"
import { EventDispatcher } from './eventDispatcher'

interface Model {
    containerId: string;
    settings: TSettings;
    fromModelChangeThumb: EventDispatcher;
    fromPresenterChangeThumb(object: any, newThumbValue: number): object;
    fromPresenterChangeThumbRight(object: any, newThumbValue: number): object;

}

class SliderModel implements Model {
    containerId: string;
    settings: TSettings;
    fromModelChangeThumb: EventDispatcher;

    constructor(containerId: string, settings: TSettings){
        this.containerId = containerId
        this.settings = settings
        this.fromModelChangeThumb = new EventDispatcher(this)
    }

    fromPresenterChangeThumb(object: any, newThumbValue: number): object {
        this.settings.currentFirst = newThumbValue;
        this.fromModelChangeThumb.notify({object, newThumbValue});
        return this;
    }

    fromPresenterChangeThumbRight(object: any, newThumbValue: number): object {
        this.settings.currentSecond = newThumbValue;
        this.fromModelChangeThumb.notify({object, newThumbValue});
        return this;
    }
}

export { Model, SliderModel }