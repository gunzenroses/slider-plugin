import { EventDispatcher } from './eventDispatcher'

//управления данными (Model), который будет содержать бизнес-логику приложения 
//и не производить никаких расчетов, которые нужны для отображения.

class SliderModel {
    constructor(containerId, settings){
        this.containerId = containerId
        this.settings = settings
        this.fromModelChangeThumb = new EventDispatcher(this)
        this.init()
    }

    init(){
        this.setupHandlers();
        this.enable();
        return this;
    }

    setupHandlers(){

    }

    enable(){
        //this.fromModelOptions.notify(this.options)
    }

    //callback from and to presenter
    fromPresenterChangeThumb(newThumbCurrent){
        this.settings.currentFirst = newThumbCurrent;
        this.fromModelChangeThumb.notify(newThumbCurrent);
        return this;
    }


}

export { SliderModel }