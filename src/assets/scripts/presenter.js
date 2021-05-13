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
        this.fromViewSelectThumbFirstHandler = this.selectThumbFirstInPresenter.bind(this);
        this.fromViewDragThumbFirstHandler = this.dragThumbFirstInPresenter.bind(this);

        this.fromModelChangeThumbFirstHandler = this.changeThumbFirstInView.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewSelectThumbFirst.add(this.fromViewSelectThumbFirstHandler);
        this.view.fromViewDragThumbFirst.add(this.fromViewDragThumbFirstHandler);

        this.model.fromModelChangeThumbFirst.add(this.fromModelChangeThumbFirstHandler);
        return this;
    }

    renderView(){
        this.view.init(this.containerId);
    }

    selectThumbFirstInPresenter(newCoord){
        //вынести отдельно повторяющиеся величины первые две?
            let containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
            let thumbWidth = getComputedStyle(this.view.sliderThumbFirst).width.replace("px","");
        let newThumbPosition = newCoord - thumbWidth/2;
        let newThumbFirst = Math.floor(newThumbPosition/containerWidth*100);
        this.changeThumbFirstInModel(newThumbFirst);
        return this;
    }

    dragThumbFirstInPresenter(e){
        let clientX = e.clientX;
            let containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
            let thumbInnerShift = this.view.dragObject.offsetX;
        let newThumbPosition = clientX - thumbInnerShift;
        let newThumbFirst = Math.floor(newThumbPosition/containerWidth*100);
        this.changeThumbFirstInModel(newThumbFirst);
        return this;
    }


    changeThumbFirstInModel(newThumbFirst){
        if (newThumbFirst >= 0 && newThumbFirst <= 100){
            this.model.fromPresenterChangeThumbFirst(newThumbFirst)
        }
    }

    changeThumbFirstInView(newThumbFirst){
        this.view.fromPresenterChangeThumbFirst(newThumbFirst)
        return this;
    }

}

export { SliderPresenter }