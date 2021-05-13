import { EventDispatcher } from "./eventDispatcher"
import { renderSliderTrack } from "./subviews/renderSliderTrack"

// Passive view!! View ничего не знает о Model // предоставляет свойства для отображения на экране,
// обновляется Presenter' ом //слой для управления отображением (View) — 
// здесь нельзя проводить никаких расчетов, относящихся к бизнес-логике. 
// Слой должен содержать логику, связанную с отображением // (например, для изменения положения ползунка слайдера на экране), 
// а также реагировать на взаимодействие пользователя с приложением. // Каждый компонент слайдера (бегунки, шкала и т. д.) должен быть представлен отдельным классом. 

class SliderView {
    constructor(){
        this.fromViewSelectThumbFirst = new EventDispatcher(this)
        this.fromViewDragThumbFirst = new EventDispatcher(this)
    }

    init(containerId){
        this.createChildren(containerId);
        this.render();
        this.setupHandlers();
        this.enable();
        return this;
    }

    createChildren(containerId){
        this.sliderContainer = document.getElementById(containerId);
            this.sliderContainer.classList.add("slider__content");
        this.sliderTrack = document.createElement("div");
            this.sliderTrack.classList.add("slider__track");
        this.sliderThumbFirst = document.createElement("div");
            this.sliderThumbFirst.classList.add("slider__thumb","thumb_first");
        this.sliderRange = document.createElement("div");
            this.sliderRange.classList.add("slider__range");
        this.dragObject = {};
        return this;
    }

    setupHandlers(){
        this.selectThumbFirstHandler = this.selectThumbFirst.bind(this);
        this.dragThumbFirstStartHandler = this.dragThumbFirstStart.bind(this);
        this.dragThumbFirstMoveHandler = this.dragThumbFirstMove.bind(this);
        this.dragThumbFirstEndHandler = this.dragThumbFirstEnd.bind(this);
        //this.simpleHandler = this.simple.bind(this);
        return this;
    }

    enable(){
        this.sliderContainer.addEventListener("click", this.selectThumbFirstHandler);
        this.sliderThumbFirst.addEventListener("mousedown", this.dragThumbFirstStartHandler);
        document.addEventListener("mousemove", this.dragThumbFirstMoveHandler);
        document.addEventListener("mouseup", this.dragThumbFirstEndHandler);
        return this;
    }

    selectThumbFirst(e){
        if (e.target === this.sliderThumbFirst) return;
        this.fromViewSelectThumbFirst.notify(e.clientX);
        return this;
    }
    
    dragThumbFirstStart(e){
        if (e.target != this.sliderThumbFirst){
            return;
        } else {
            this.dragObject.elem = e.target;
            this.dragObject.offsetX = e.offsetX;
            this.dragObject.clientX = e.clientX;
            return this;
        }
    }

    dragThumbFirstMove(e){
        e.preventDefault();
        if (!this.dragObject.elem) return;
        this.fromViewDragThumbFirst.notify(e);
        return this;
    }

    dragThumbFirstEnd(){
        this.dragObject = {};
        (this.sliderThumbFirst.style.left);
        return this;
    }



    // subviews?
    fromPresenterChangeThumbFirst(newThumbFirst){
        this.sliderThumbFirst.style.left = newThumbFirst + "%";
        this.sliderRange.style.right = (100 - newThumbFirst) + "%";
        return this;
    }


    render(){
        //поставить вызовы функций для отрисовки каждого элемента!
        this.sliderContainer.innerHTML = "";
        this.sliderContainer.prepend(this.sliderTrack);
        this.sliderContainer.append(this.sliderThumbFirst);
        this.sliderContainer.append(this.sliderRange);
        return this;
    }
}

export { SliderView }