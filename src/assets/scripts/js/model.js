// import { EventDispatcher } from './eventDispatcher'

// //управления данными (Model), который будет содержать бизнес-логику приложения 
// //и не производить никаких расчетов, которые нужны для отображения.

// class SliderModel {
//     constructor(containerId, settings){
//         this.containerId = containerId
//         this.settings = settings
//         this.fromModelChangeThumb = new EventDispatcher(this)
//         this.init()
//     }

//     init(){
//         this.setupHandlers();
//         this.enable();
//         return this;
//     }

//     setupHandlers(){

//     }

//     enable(){
//         //this.fromModelOptions.notify(this.options)
//     }

//     //callback from and to presenter
//     fromPresenterChangeThumb(object, newThumbValue){
//         this.settings.currentFirst = newThumbValue;
//         this.fromModelChangeThumb.notify({object, newThumbValue});
//         return this;
//     }

//     fromPresenterChangeThumbRight(object, newThumbValue){
//         this.settings.currentSecond = newThumbValue;
//         this.fromModelChangeThumb.notify({object, newThumbValue});
//         return this;
//     }


// }

// export { SliderModel }