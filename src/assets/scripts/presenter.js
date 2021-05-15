//слой для обновления модели и отображения (Presenter).
// Это - единственный слой среди трех, который может иметь зависимость от других слоев.
// Он будет:
//реагировать на сообщения от отображения о действиях пользователей и обновлять модель;
//реагировать на сообщения об обновлении модели и обновлять отображение.

class SliderPresenter {
    constructor(model, view){
        this.model = model
        this.view = view
        this.containerId = this.model.containerId
        this.settings = this.model.settings
        this.init();
    }

    init(){
        this.view.init(this.containerId, this.settings);
        this.createChildren();
        this.setupHandlers();
        this.enable();
        this.renderView();
        return this;
    }

    createChildren(){
        this.containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
        this.thumbWidth = getComputedStyle(this.view.sliderThumb).width.replace("px","");
    }

    setupHandlers(){
        this.fromViewSelectThumbHandler = this.selectThumbInPresenter.bind(this);
        this.fromViewDragThumbHandler = this.dragThumbInPresenter.bind(this);

        this.fromModelChangeThumbHandler = this.changeThumbInView.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
        this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);

        this.model.fromModelChangeThumb.add(this.fromModelChangeThumbHandler);
        return this;
    }

    renderView(){
        
    }

    selectThumbInPresenter(newCoord){
        let newThumbCurrentPosition = newCoord - this.thumbWidth;
        let newThumbCurrentPercent = Math.floor(newThumbCurrentPosition/this.containerWidth*100);
        if (!this.model.settings.range){ this.selectThumbInPresenterRangeFalse(newThumbCurrentPercent)};
        if (this.model.settings.range){ this.selectThumbInPresenterRangeTrue(newThumbCurrentPercent)};
        return;
    }

    selectThumbInPresenterRangeFalse(newThumbCurrentPercent){
        this.view.selectObject = this.view.sliderThumb;
        this.changeThumbInModel(newThumbCurrentPercent);
        return this;
    }

    selectThumbInPresenterRangeTrue(newThumbCurrentPercent){
            let firstThumb = getComputedStyle(this.view.sliderThumb).left.replace("px","");
            let secondThumb = getComputedStyle(this.view.sliderThumbSecond).left.replace("px","");
            let firstThumbCoord = Math.floor(firstThumb/this.containerWidth*100);
            let secondThumbCoord = Math.floor(secondThumb/this.containerWidth*100);
        let firstDiff = Math.abs(firstThumbCoord - newThumbCurrentPercent);
        let secondDiff = Math.abs(secondThumbCoord - newThumbCurrentPercent);
        if (firstDiff <= secondDiff){ 
            this.view.selectObject = this.view.sliderThumb;
            this.changeThumbInModel(newThumbCurrentPercent) 
        } if (firstDiff > secondDiff){
            this.view.selectObject = this.view.sliderThumbSecond;
            this.changeThumbRightInModel(newThumbCurrentPercent);
        }
        return this;
    }

    dragThumbInPresenter(e){
        this.thumbInnerShift = this.view.dragObject.offsetX;
        let newThumbCurrentPosition = e.clientX - this.thumbInnerShift;
        let newThumbCurrent = Math.floor(newThumbCurrentPosition/this.containerWidth*100);
        this.changeThumbInModel(newThumbCurrent);
        return this;
    }


    changeThumbInModel(newThumbValue){
        if (newThumbValue >= 0 && newThumbValue <= 100){
            this.model.fromPresenterChangeThumb(newThumbValue);
        }
    }

    changeThumbRightInModel(newThumbValue){
        if (newThumbValue >= 0 && newThumbValue <= 100){
            this.model.fromPresenterChangeThumbRight(newThumbValue);
        }
    }

    changeThumbInView(newThumbValue){
        this.view.fromPresenterChangeThumb(newThumbValue);
        this.view.fromPresenterChangeRange(newThumbValue);
        return this;
    }
}

export { SliderPresenter }