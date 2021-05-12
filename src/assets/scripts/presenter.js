//слой для обновления модели и отображения (Presenter).
// Это - единственный слой среди трех, который может иметь зависимость от других слоев.
// Он будет:
//реагировать на сообщения от отображения о действиях пользователей и обновлять модель;
//реагировать на сообщения об обновлении модели и обновлять отображение.

import { event } from "jquery";

class SliderPresenter {
    constructor(model, view){
        this.model = model
        this.view = view
        this.containerId = this.model.containerId
        this.settings = this.model.settings
        this.init();
    }

    init(){
        this.createChildren();
        this.setupHandlers();
        this.enable();
        this.renderView();
        return this;
    }

    createChildren(){
            
        return this;
    }

    setupHandlers(){
        this.fromViewChangeCurentFirstHandler = this.changeCurrentFirstInModel.bind(this);
        this.fromModelChangeCurrentFirstHandler = this.changeCurrentFirstInView.bind(this);

        this.fromViewDragThumbFirstHandler = this.dragThumbFirstInModel.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewChangeCurrentFirst.add(this.fromViewChangeCurentFirstHandler);
        this.model.fromModelChangeCurrentFirst.add(this.fromModelChangeCurrentFirstHandler);

        this.view.fromViewDragThumbFirst.add(this.fromViewDragThumbFirstHandler);
        return this;
    }

    renderView(){
        this.view.init(this.containerId);
    }

    changeCurrentFirstInModel(newFirst){
        let sliderContainerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
        let percentFirst = parseInt(newFirst/sliderContainerWidth*100);
        if (percentFirst > 0 && percentFirst <=100){
            this.model.changeCurrentFirst(percentFirst)
        }
        return this;
    }

    changeCurrentFirstInView(newCurrentFirst){
        this.view.fromPresenterChangeCurrentFirst(newCurrentFirst)
        return this;
    }

    dragThumbFirstInModel(clientX){
        let sliderContainerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
        let thumbWidth = getComputedStyle(this.view.sliderThumbFirst).width.replace("px","");
        let moveLeft = clientX - thumbWidth/2;
        let styleLeft = parseInt(moveLeft/sliderContainerWidth*100);

        this.changeCurrentFirstInModel(styleLeft)

        // document.addEventListener('mousemove', (event)=>{
        //     console.log(event.clientX)
        //     //let moveLeft = event.clientX - thumbWidth/2;
        // });

        // this.view.sliderThumbFirst.onmouseup = ()=>{
        //     document.removeEventListener('mousemove', ()=>{
        //         let styleLeft = event.pageX - shiftX + "px";
        //     });
        // }
        // // отпустить мяч, удалить ненужные обработчики
        // ball.onmouseup = function() {
        //     document.removeEventListener('mousemove', onMouseMove);
        //     ball.onmouseup = null;
        // };
        return this;
    }

}

export { SliderPresenter }