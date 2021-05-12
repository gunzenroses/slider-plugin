import { EventDispatcher } from "./eventDispatcher"
import { renderSliderTrack } from "./subviews/renderSliderTrack"

// Passive view!! View ничего не знает о Model // предоставляет свойства для отображения на экране,
// обновляется Presenter' ом //слой для управления отображением (View) — 
// здесь нельзя проводить никаких расчетов, относящихся к бизнес-логике. 
// Слой должен содержать логику, связанную с отображением // (например, для изменения положения ползунка слайдера на экране), 
// а также реагировать на взаимодействие пользователя с приложением. // Каждый компонент слайдера (бегунки, шкала и т. д.) должен быть представлен отдельным классом. 

class SliderView {
    constructor(){
        this.fromViewChangeCurrentFirst = new EventDispatcher(this)
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
        return this;
    }

    setupHandlers(){
        this.changeCurrentFirstHandler = this.changeCurrentFirst.bind(this);
        this.dragThumbFirstHandler = this.dragThumbFirst.bind(this);
        return this;
    }

    enable(){
        this.sliderContainer.addEventListener("click", this.changeCurrentFirstHandler);
        this.sliderThumbFirst.addEventListener("mousedown", this.dragThumbFirstHandler);
        return this;
    }

    changeCurrentFirst(e){
        this.fromViewChangeCurrentFirst.notify(e.clientX);
        return this;
    }
    
    fromPresenterChangeCurrentFirst(newCurrentFirst){
        this.sliderThumbFirst.style.left = newCurrentFirst+"%";
        this.sliderRange.style.right = (100 - newCurrentFirst) + "%";
        return this;
    }


    dragThumbFirst(){
        document.addEventListener("mousemove", (e)=>{
            this.fromViewDragThumbFirst.notify(e.clientX)
        })
        return this;
    }

    fromPresenterDragThumbFirst(styleLeft){
        this.sliderThumbFirst.style.left = styleLeft + "%";
        return this;
    }

    render(){
        //поставить вызовы функций для отрисовки каждого элемента!
        this.sliderContainer.innerHTML = "";
        this.sliderContainer.append(this.sliderTrack);
        this.sliderContainer.append(this.sliderThumbFirst);
        this.sliderContainer.append(this.sliderRange);
        
        return this;
    }
}

export { SliderView }