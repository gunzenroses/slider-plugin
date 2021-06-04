import { EventDispatcher } from "../eventDispatcher"
import { SliderContainer } from "../subviews/SliderContainer"
import { SliderTrack } from "../subviews/SliderTrack"
import { SliderThumb } from "../subviews/SliderThumb"
import { SliderRange } from "../subviews/SliderRange"

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
        this.render();
        this.setupHandlers();
        this.enable();
        return this;
    }

    createChildren(containerId){
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
        if (e.target === this.sliderThumb) return;
        this.fromViewSelectThumb.notify(e.clientX);
        return this;
    }
    
    dragThumbStart(e){
        if (e.target != this.sliderThumb){
            return;
        } else {
            this.dragObject.elem = e.target;
            // this.dragObject.offsetX = e.offsetX;
            // this.dragObject.clientX = e.clientX;
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
        this.sliderThumb.style.left = newThumbCurrent + "%";
        return this;
    }

    fromPresenterChangeRange(newThumbCurrent){
        this.sliderRange.style.right = (100 - newThumbCurrent) + "%";
        return this;
    }

    //render slider
    renderSliderContainer(containerId){
        this.sliderContainer = new SliderContainer(containerId);
        return this;
    }

    renderSliderTrack(){
        this.sliderTrack = new SliderTrack();
        this.sliderContainer.prepend(this.sliderTrack);
        return this;
    }

    renderSliderThumb(className){
        if (!this.sliderThumb){
            this.sliderThumb = new SliderThumb(className)
            this.sliderContainer.append(this.sliderThumb);
        } else if (this.sliderThumb){
            this.sliderThumbSecond = new SliderThumb(className)
            this.sliderContainer.append(this.sliderThumbSecond);
        }
        return this;
    }

    renderSliderRange(){
        this.sliderRange = new SliderRange();
        this.sliderContainer.append(this.sliderRange);
        return this;
    }

    render(){
        this.renderSliderContainer(this.containerId);
        this.renderSliderTrack();
        this.renderSliderThumb("thumb_first");
        if (this.settings.range){
            this.renderSliderThumb("thumb_second");
        }
        this.renderSliderRange();
        return this;
    }
}




export { SliderView }