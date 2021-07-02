import { ISender, EventDispatcher } from "./eventDispatcher"
import { TSettings, TDragObject } from "./types/types"
import { sliderContainerView } from "./subview/trackView/sliderContainer/sliderContainerView"
import { sliderTrackView } from "./subview/trackView/sliderTrack/sliderTrackView"
import { sliderThumbView } from "./subview/trackView/sliderThumb/slideThumbView"
import { changeThumb } from "./subview/trackView/sliderThumb/changeThumb"
import { sliderRangeView } from "./subview/trackView/sliderRange/sliderRangeView"
import { changeRange } from "./subview/trackView/sliderRange/changeRange"
import { tooltipItemView } from "./subview/tooltipView/tooltipItemView"
import { changeTooltip } from "./subview/tooltipView/changeTooltip"
import { scaleView } from "./subview/scaleView/scaleView"

interface IView {
    settings: TSettings;

    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;

    parentContainer: HTMLElement;
    sliderContainer: HTMLElement;
    sliderThumb: HTMLElement;
    sliderThumbSecond?: HTMLElement;
    sliderRange: HTMLElement;
    sliderTrack: HTMLElement;
    tooltipRow?: HTMLElement;
    tooltipFirst?: HTMLElement;
    tooltipSecond?: HTMLElement;
    scale?: HTMLElement;

    selectObject: TDragObject;
    dragObject: TDragObject;

    changeHandler: (number: number) => void;

    init(settings: TSettings): void;
    //createChildren(): void;
    //setupHandlers(): void;
    //enable(): void;
    render(): void;
    
    // selectThumb(e: MouseEvent): void;
    // dragThumbStart(e: MouseEvent): void;
    сhange(newThumbCurrent: number): void;
    dragThumbEnd(): void;
}

class SliderView implements IView {
    parentContainer: HTMLElement;
    settings!: TSettings;
    fromViewSelectThumb: EventDispatcher
    fromViewDragThumb: EventDispatcher

    sliderContainer!: HTMLElement;
    sliderThumb!: HTMLElement;
    sliderThumbSecond!: HTMLElement;
    sliderRange!: HTMLElement;
    sliderTrack!: HTMLElement;
    tooltipRow!: HTMLElement;
    tooltipFirst!: HTMLElement;
    tooltipSecond!: HTMLElement;
    scale!: HTMLElement;

    selectObject!: TDragObject; //{elem: EventTarget, offsetX: number} | {};
    dragObject!: TDragObject;
    thumbSecondPosition!: number;
    containerWidth!: number;

    selectThumbHandler!: { (ev: MouseEvent): void };
    dragThumbStartHandler!: { (ev: MouseEvent ): void };
    dragThumbMoveHandler!: { (ev: MouseEvent ): void };
    dragThumbEndHandler!: () => void;
    changeHandler!: (number: number) => void;

    ifHorizontal!: boolean;
    ifRange!: boolean;
    ifTooltip!: boolean;
    ifScale!: boolean;
    step!: number;
    max!: number;
    min!: number;

    stepPerDiv!: number;

    sliderRangeClass!: string;
    sliderTrackClass!: string;
    sliderThumbFirstClass!: string;
    sliderThumbSecondClass!: string;

    constructor(containerId: string){
        this.fromViewSelectThumb = new EventDispatcher();
        this.fromViewDragThumb = new EventDispatcher();
        this.parentContainer = document.getElementById(containerId)!;
    }

    init(settings: TSettings){
        this.settings = settings;
        this.createChildren();
        this.render();
        this.setupHandlers();
        this.enable();
    }

    createChildren(){
        this.selectObject = {};
        this.ifHorizontal = this.settings.orientation === "horizontal";
        this.ifRange = this.settings.range;
        this.ifTooltip = this.settings.tooltip;
        this.ifScale = this.settings.scale;
        this.stepPerDiv = this.settings.scale.stepPerDiv;
        this.step = this.settings.step;
        this.max = this.settings.max;
        this.min = this.settings.min;
    }

    setupHandlers(){
        this.selectThumbHandler = this.selectThumb.bind(this);
        this.dragThumbStartHandler = this.dragThumbStart.bind(this);
        this.dragThumbMoveHandler = this.dragThumbMove.bind(this);
        this.dragThumbEndHandler = this.dragThumbEnd.bind(this);
        this.changeHandler = this.сhange.bind(this);
    }

    enable(){
        this.sliderContainer.addEventListener("click", this.selectThumbHandler);
        this.sliderThumb.addEventListener("mousedown", this.dragThumbStartHandler);
        // this.sliderThumb.addEventListener("touchstart", this.dragThumbStartHandler);
        if (this.settings.range){ 
            this.sliderThumbSecond.addEventListener("mousedown", this.dragThumbStartHandler); 
            // this.sliderThumbSecond.addEventListener("touchstart", this.dragThumbStartHandler);
        };
        document.addEventListener("mousemove", this.dragThumbMoveHandler);
        document.addEventListener("mouseup", this.dragThumbEndHandler);
        // document.addEventListener("touchmove", this.dragThumbMoveHandler);
        // document.addEventListener("touchend", this.dragThumbEndHandler);
    }

    selectThumb(e: MouseEvent){
        if (e.target === this.sliderThumb || 
            e.target === this.sliderThumbSecond) return;
        this.fromViewSelectThumb.notify(event);
    }
    
    dragThumbStart(e: MouseEvent){
        e.preventDefault;
        if (e.target !== this.sliderThumb &&
            e.target !== this.sliderThumbSecond)
            return;
        else {
            if (e.type === "mousedown"){
                let mouseEvent = e as MouseEvent;
                this.dragObject = e.target;
            // } else {
            //     let touchEvent = e as TouchEvent;
            //         let rect  = touchEvent.target!.getBoundingClientRect();
            //         let offsetX = touchEvent.targetTouches[0].clientX - rect.x;
            //         let offsetY = touchEvent.targetTouches[0].clientY - rect.y
                
            //     this.selectObject = touchEvent.touches[0].target;
            //     this.ifHorizontal
            //         ? this.selectObject.offset = offsetX
            //         : this.selectObject.offset = offsetY;
            }
        }
    }

    dragThumbMove(e: MouseEvent){
        e.preventDefault;
        if (!this.dragObject) return;
        this.fromViewDragThumb.notify(e);
    }

    dragThumbEnd(){
        this.dragObject = {};
        this.selectObject = {};
    }

    сhange(newThumbCurrent: number){
        //fix: validate newThumbCurrent to be 0 to 100?
        
        let object = (this.dragObject.classList !== undefined)
            ? this.dragObject 
            : this.selectObject

        console.log(object)

        changeThumb(object, this.ifHorizontal, newThumbCurrent)

        let ifThumbFirst = (object === this.sliderThumb)
        changeRange(this.sliderRange, newThumbCurrent, this.ifHorizontal, this.ifRange, ifThumbFirst);
        
        if (this.ifTooltip) {
            (object.children[0] === this.tooltipFirst)
                ? changeTooltip(this.tooltipFirst, newThumbCurrent, this.max, this.min)
                : changeTooltip(this.tooltipSecond, newThumbCurrent, this.max, this.min)
        }
    }

    render(){
        this.parentContainer.innerHTML = "";
        this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal, this.max, this.min, this.step);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal, this.max, this.min, this.step)
        this.ifTooltip
            ? this.tooltipFirst = tooltipItemView(this.sliderThumb, "tooltip_first", this.settings.currentFirst, this.ifHorizontal, this.max, this.min, this.step)
            : null;
        this.ifRange
            ? (this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal, this.max, this.min, this.step),
                this.ifTooltip
                    ? this.tooltipSecond = tooltipItemView(this.sliderThumbSecond, "tooltip_second", this.settings.currentSecond, this.ifHorizontal, this.max, this.min, this.step)
                    : null)
            : null;
        this.ifScale
            ? (this.scale = scaleView(this.sliderContainer, this.ifHorizontal, this.max, this.min,  this.step, this.stepPerDiv))
            : null;
        return this;
    }
}

export { IView, SliderView }