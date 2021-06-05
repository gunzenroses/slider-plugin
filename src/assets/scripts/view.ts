import { EventDispatcher } from "./eventDispatcher"
import { Settings } from "./types/types"
import { sliderThumbMaker } from "./subview/sliderThumbMaker"
import { sliderTrackMaker } from "./subview/sliderTrackMaker"
import { sliderRangeMaker } from "./subview/sliderRangeMaker"

interface View {
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;

    containerId: string;
    settings: Settings;
    dragObject: Settings;
    // thumbSecondPosition: number;
    // containerWidth: number;

    init(containerId: string, settings: Settings): object;
    createClasses(): object;
    createChildren(containerId: string): object;
    setupHandlers(): object;
    enable(): object;
    render(): void;

    sliderContainer: HTMLElement;
    sliderThumb: HTMLElement;
    sliderThumbSecond: HTMLElement;
    sliderRange: HTMLElement;
    sliderTrack: HTMLElement;


    selectObject: HTMLElement;

    // selectThumb(ev: MouseEvent): object | undefined;
    // dragThumbStart(ev: MouseEvent): object | undefined;
    // dragThumbMove(ev: MouseEvent): object | undefined;
    // dragThumbEnd(): object;

    fromPresenterChangeThumb(object: object, newThumbCurrent: number): object;
    fromPresenterChangeRange(object: object, newThumbCurrent: number): object;
}



class SliderView implements View {
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;
    sliderContainer: HTMLElement;
    
    containerId!: string;
    settings!: Settings;
    dragObject!: any; //{elem: EventTarget, offsetX: number} | {};
    thumbSecondPosition!: number;
    containerWidth!: number;

    selectThumbHandler!: { (ev: MouseEvent): object | undefined };
    dragThumbStartHandler!: { (ev: MouseEvent): object | undefined};
    dragThumbMoveHandler!: { (ev: MouseEvent): object | undefined};
    dragThumbEndHandler!: () => object;

    sliderThumb!: HTMLElement;
    sliderThumbSecond!: HTMLElement;
    sliderRange!: HTMLElement;
    sliderTrack!: HTMLElement;

    sliderRangeClass!: string;
    sliderTrackClass!: string;
    sliderThumbFirstClass!: string;
    sliderThumbSecondClass!: string;

    selectObject!: HTMLElement;

    constructor(containerId: string){
        this.fromViewSelectThumb = new EventDispatcher(this)
        this.fromViewDragThumb = new EventDispatcher(this)
        this.sliderContainer = document.getElementById(containerId)!;
        this.sliderContainer.classList.add("slider__content");
    }

    init(containerId: string, settings: Settings){
        this.containerId = containerId;
        this.settings = settings;
        this.createClasses();
        this.render();
        this.createChildren();
        this.setupHandlers();
        this.enable();
        return this;
    }

    createClasses(){
        this.sliderRangeClass = this.settings.orientation === "horisontal"
                            ? (this.settings.range ? "slider__range_true" : "")
                            : (this.settings.range ? "slider__range_vertical-true" : "slider__range_vertical");
        this.sliderTrackClass = this.settings.orientation === "horisontal" 
                            ? "slider__track" 
                            : "slider__track_vertical" ;
        this.sliderThumbFirstClass = this.settings.orientation === "horisontal"
                            ? "thumb_first" 
                            : "thumb_first-vertical";
        this.sliderThumbSecondClass = this.settings.orientation === "horisontal"
                            ? "thumb_second"
                            : "thumb_second-vertical";
        return this;
    }

    createChildren(){
        this.dragObject = {};
        this.sliderRange = this.sliderContainer.querySelector(`.${this.sliderRangeClass}`)!; //slider__range
        this.sliderThumb = this.sliderContainer.querySelector(`.${this.sliderThumbFirstClass}`)!;
        this.sliderTrack = this.sliderContainer.querySelector(`${this.sliderTrackClass}`)!;
        if (this.settings.range){
            this.sliderThumbSecond = this.sliderContainer.querySelector(`.${this.sliderThumbSecondClass}`)!;
            this.thumbSecondPosition = parseInt(getComputedStyle(this.sliderThumbSecond).left.replace("px",""))/this.containerWidth*100;
        }
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
        if (this.settings.range){ this.sliderThumbSecond.addEventListener("mousedown", this.dragThumbStartHandler) };
        document.addEventListener("mousemove", this.dragThumbMoveHandler);
        document.addEventListener("mouseup", this.dragThumbEndHandler);
        return this;
    }

    selectThumb(e: MouseEvent){
        if (e.target === this.sliderThumb || 
            e.target === this.sliderThumbSecond ) return;
        this.fromViewSelectThumb.notify(e.clientX);
        return this;
    }
    
    dragThumbStart(e: MouseEvent){
        e.preventDefault();
        if (e.target !== this.sliderThumb &&
            e.target !== this.sliderThumbSecond) 
            return;
        else {
            this.dragObject.elem = e.target;
            this.dragObject.offsetX = e.offsetX;
            return this;
        }
    }

    dragThumbMove(e: MouseEvent){
        if (!this.dragObject.elem) return;
        this.fromViewDragThumb.notify(e);
        return this;
    }

    dragThumbEnd(){
        this.dragObject = {};
        return this;
    }



    fromPresenterChangeThumb(object: any, newThumbCurrent: number){
        console.log(object)
        console.log(newThumbCurrent)
        object.style.left = newThumbCurrent + "%";
        return this;
    }

    fromPresenterChangeRange(object: object, newThumbCurrent: number){
        if (object === this.sliderThumb){
            this.sliderRange.style.right = (100 - newThumbCurrent) + "%";
        } else if (object === this.sliderThumbSecond){
            this.sliderRange.style.left = newThumbCurrent + "%";
        }
        return this;
    }

    render(){
        this.sliderContainer.innerHTML = "";

        this.sliderContainer.innerHTML += 
                            sliderTrackMaker(this.sliderTrackClass)
                                + sliderThumbMaker(this.sliderThumbFirstClass) 
                                + sliderThumbMaker(this.sliderThumbSecondClass)
                                + sliderRangeMaker(this.sliderRangeClass);
                            `</div>`;
        return this;
    }
}

export { View, SliderView }