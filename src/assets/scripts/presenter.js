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
        this.fromViewSelectCurentFirstHandler = this.selectCurrentFirstInPresenter.bind(this);
        this.fromModelChangeCurrentFirstHandler = this.changeCurrentFirstInView.bind(this);

        this.fromViewDragThumbFirstHandler = this.dragThumbFirstInPresenter.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewSelectCurrentFirst.add(this.fromViewSelectCurentFirstHandler);
        this.model.fromModelChangeCurrentFirst.add(this.fromModelChangeCurrentFirstHandler);
        this.view.fromViewDragThumbFirst.add(this.fromViewDragThumbFirstHandler);
        return this;
    }

    renderView(){
        this.view.init(this.containerId);
    }

    selectCurrentFirstInPresenter(newCoord){
        //вынести отдельно повторяющиеся величины первые две?
        let containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
        let thumbWidth = getComputedStyle(this.view.sliderThumbFirst).width.replace("px","");
        let newThumbPosition = newCoord - thumbWidth/2;
        let newCurrentFirst = parseInt(newThumbPosition/containerWidth*100);
        this.changeCurrentFirstInModel(newCurrentFirst);
        return this;
    }

    changeCurrentFirstInModel(newCurrentFirst){
        if (newCurrentFirst > 0 && newCurrentFirst <=100){
            this.model.fromPresenterChangeCurrentFirst(newCurrentFirst)
        }
    }

    changeCurrentFirstInView(newCurrentFirst){
        this.view.fromPresenterChangeCurrentFirst(newCurrentFirst)
        return this;
    }

    dragThumbFirstInPresenter(e){
        let clientX = e.clientX;
        let containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
        let thumbInnerShift = this.view.dragObject.offsetX;

        let newThumbPosition = clientX - thumbInnerShift;
        let newCurrentFirst = parseInt(newThumbPosition/containerWidth*100);
        this.changeCurrentFirstInModel(newCurrentFirst);
        // if (newCurrentFirst > 0 && newCurrentFirst <=100){
        //     //this.model.changeCurrentFirst(thumbStyleLeft)
        //     this.view.fromPresenterChangeCurrentFirst(newCurrentFirst);
        // }
        return this;
    }

}

export { SliderPresenter }