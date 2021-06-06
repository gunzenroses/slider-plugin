import { EventDispatcher } from "./eventDispatcher"
import { TSettings } from "./types/types"
import { labelView } from "./subview/labelView/labelView"
import { sliderTrackView } from "./subview/trackView/sliderTrack/sliderTrackView"

interface IView {
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;

    containerId: string;
    settings: TSettings;
    dragObject: TSettings;

    init(containerId: string, settings: TSettings): object;
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

    selectObject: any; //HTMLElement;

    // selectThumb(ev: MouseEvent): object | undefined;
    // dragThumbStart(ev: MouseEvent): object | undefined;
    // dragThumbMove(ev: MouseEvent): object | undefined;
    // dragThumbEnd(): object;

    fromPresenterChangeThumb(object: object, newThumbCurrent: number): object;
    fromPresenterChangeRange(object: object, newThumbCurrent: number): object;
}


class SliderView implements IView {
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;
    sliderContainer: HTMLElement;
    
    containerId!: string;
    settings!: TSettings;
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

    ifHorizontal!: boolean;
    ifRange!: boolean;

    sliderRangeClass!: string;
    sliderTrackClass!: string;
    sliderThumbFirstClass!: string;
    sliderThumbSecondClass!: string;

    selectObject!: any; //HTMLElement;

    constructor(containerId: string){
        this.fromViewSelectThumb = new EventDispatcher(this)
        this.fromViewDragThumb = new EventDispatcher(this)
        this.sliderContainer = document.getElementById(containerId)!;
    }

    init(containerId: string, settings: TSettings){
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
        this.ifHorizontal = this.settings.orientation === "horizontal";
        this.ifRange = this.settings.range;
        this.sliderContainer.classList.add(
            this.ifHorizontal 
                            ? "slider__content" 
                            : "slider__content_vertical");
        this.sliderRangeClass = this.ifHorizontal
                            ? (this.ifRange 
                                ? "slider__range_true" 
                                : "slider__range")
                            : (this.ifRange 
                                ? "slider__range_vertical-true" 
                                : "slider__range_vertical");
        this.sliderTrackClass = this.ifHorizontal 
                            ? "slider__track" 
                            : "slider__track_vertical" ;
        this.sliderThumbFirstClass = this.ifHorizontal
                            ? "thumb_first" 
                            : "thumb_first-vertical";
        if (this.ifRange){
            this.sliderThumbSecondClass = this.ifHorizontal
                ? "thumb_second"
                : "thumb_second-vertical";
        }
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
            e.target === this.sliderThumbSecond) return;
        this.fromViewSelectThumb.notify(event);
        return this;
    }
    
    dragThumbStart(e: MouseEvent){
        e.preventDefault;
        if (e.target !== this.sliderThumb &&
            e.target !== this.sliderThumbSecond)
            return;
        else {
            this.dragObject.elem = e.target;
            this.ifHorizontal
                ? this.dragObject.offset = e.offsetX
                : this.dragObject.offset = e.offsetY;
            return this;
        }
    }

    dragThumbMove(e: MouseEvent){
        e.preventDefault;
        if (!this.dragObject.elem) return;
        this.fromViewDragThumb.notify(e);
        return this;
    }

    dragThumbEnd(){
        this.dragObject = {};
        return this;
    }



    fromPresenterChangeThumb(object: any, newThumbCurrent: number){
        this.ifHorizontal
                    ? object.style.left = newThumbCurrent + "%"
                    : object.style.top = newThumbCurrent + "%";
        return this;
    }

    fromPresenterChangeRange(object: object, newThumbCurrent: number){
        this.ifRange
        ? this.ifHorizontal
                ? ((object === this.sliderThumb) 
                    ? this.sliderRange.style.left = newThumbCurrent + "%"
                    : this.sliderRange.style.right = (100 - newThumbCurrent) + "%")
                : ((object === this.sliderThumb) 
                    ? this.sliderRange.style.top = newThumbCurrent + "%"
                    : this.sliderRange.style.bottom = (100 - newThumbCurrent) + "%")
        : this.ifHorizontal
                ? this.sliderRange.style.right = (100 - newThumbCurrent) + "%"
                : this.sliderRange.style.bottom = (100 - newThumbCurrent) + "%";
        return this;
    }

    render(){
        this.sliderContainer.innerHTML = "";
        this.sliderContainer.innerHTML += 
            `
                ${labelView(this.ifRange, this.ifHorizontal, 
                        this.settings.currentFirst, this.settings.currentSecond)}
                ${sliderTrackView(this.ifRange, this.ifHorizontal)}
            `;
        return this;
    }
}

export { IView, SliderView }