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
        this.setupHandlers();
        this.enable();
        this.renderView();
        return this;
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
        //вынести отдельно повторяющиеся величины первые две?
            let containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
            let thumbWidth = getComputedStyle(this.view.sliderThumb).width.replace("px","");
        let newThumbCurrentPosition = newCoord - thumbWidth/2;
        let newThumbCurrent = Math.floor(newThumbCurrentPosition/containerWidth*100);
        this.changeThumbInModel(newThumbCurrent);
        return this;
    }

    dragThumbInPresenter(e){
        let clientX = e.clientX;
            let containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
            let thumbInnerShift = this.view.dragObject.offsetX;
        let newThumbCurrentPosition = clientX - thumbInnerShift;
        let newThumbCurrent = Math.floor(newThumbCurrentPosition/containerWidth*100);
        this.changeThumbInModel(newThumbCurrent);
        return this;
    }


    changeThumbInModel(newThumbCurrent){
        if (newThumbCurrent >= 0 && newThumbCurrent <= 100){
            this.model.fromPresenterChangeThumb(newThumbCurrent);
        }
    }

    changeThumbInView(newThumbCurrent){
        this.view.fromPresenterChangeThumb(newThumbCurrent);
        this.view.fromPresenterChangeRange(newThumbCurrent);
        return this;
    }
}

export { SliderPresenter }