import { EventDispatcher } from "./eventDispatcher"
import { RangeFalse } from "./strateries/rangeFalse"
import { RangeTrue } from "./strateries/rangeTrue";

// Passive view!! View ничего не знает о Model // предоставляет свойства для отображения на экране,
// обновляется Presenter' ом //слой для управления отображением (View) — 
// здесь нельзя проводить никаких расчетов, относящихся к бизнес-логике. 
// Слой должен содержать логику, связанную с отображением // (например, для изменения положения ползунка слайдера на экране), 
// а также реагировать на взаимодействие пользователя с приложением. // Каждый компонент слайдера (бегунки, шкала и т. д.) должен быть представлен отдельным классом. 

class SliderView {
    constructor(){
        this.fromViewSelectThumb = new EventDispatcher(this)
        this.fromViewDragThumb = new EventDispatcher(this)
    }

    init(containerId, settings){
        this.createChildren(containerId);
        this.containerId = containerId;
        this.settings = settings;
        this.slider;
        this.render();
        this.setupHandlers();
        this.enable();
        return this;
    }

    createChildren(containerId){
        this.selectObject;
        this.dragObject = {};
        return this;
    }

    setupHandlers(){
        this.selectThumbHandler = this.selectThumb.bind(this);
        this.dragThumbStartHandler = this.dragThumbStart.bind(this);
        this.dragThumbMoveHandler = this.dragThumbMove.bind(this);
        this.dragThumbEndHandler = this.dragThumbEnd.bind(this);
        return this;
    }

    enable(){
        this.sliderContainer.addEventListener("click", this.selectThumbHandler);
        this.sliderThumb.addEventListener("mousedown", this.dragThumbStartHandler);
        document.addEventListener("mousemove", this.dragThumbMoveHandler);
        document.addEventListener("mouseup", this.dragThumbEndHandler);
        return this;
    }

    selectThumb(e){
        if (e.target === this.sliderThumb || 
            e.target === this.sliderThumbSecond) return;
        this.fromViewSelectThumb.notify(e.clientX)
        return this;
    }
    
    dragThumbStart(e){
        if (e.target != this.sliderThumb){
            return;
        } else {
            this.dragObject.elem = e.target;
            return this;
        }
    }

    dragThumbMove(e){
        e.preventDefault();
        if (!this.dragObject.elem) return;
        this.fromViewDragThumb.notify(e);
        return this;
    }

    dragThumbEnd(){
        this.dragObject = {};
        return this;
    }

    fromPresenterChangeThumb(newThumbCurrent){
        this.selectObject.style.left = newThumbCurrent + "%";
        return this;
    }

    fromPresenterChangeRange(newThumbCurrent){
        if (this.selectObject === this.sliderThumb){
            this.sliderRange.style.right = (100 - newThumbCurrent) + "%";
        } else if (this.selectObject === this.sliderThumbSecond){
            this.sliderRange.style.left = newThumbCurrent + "%";
        }
        return this;
    }

    render(){
        if (!this.settings.range){ return new RangeFalse(this, this.containerId)}
        else if (this.settings.range){ return new RangeTrue(this, this.containerId)}
        return this;
    }
}




export { SliderView }