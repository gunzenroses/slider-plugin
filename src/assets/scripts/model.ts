import { EventDispatcher } from './eventDispatcher'

interface Model {
    containerId: string;
    [propName: string]: any;
    fromPresenterChangeThumb(object: any, newThumbValue: number): object;
    fromPresenterChangeThumbRight(object: any, newThumbValue: number): object;

}

class SliderModel implements Model {
    containerId: string;
    settings: any;
    fromModelChangeThumb: EventDispatcher;

    constructor(containerId: string, settings: any){
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