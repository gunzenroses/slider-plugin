import { EventDispatcher } from "./eventDispatcher"
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
import { changeValueToPercents } from "./common"

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

    changeHandler: (object: TDragObject, number: number) => void;

    init(settings: TSettings): void;
    //createChildren(): void;
    //setupHandlers(): void;
    //enable(): void;
    render(): void;
    
    // selectThumb(e: MouseEvent): void;
    // dragThumbStart(e: MouseEvent): void;
    сhange(object: TDragObject, newThumbCurrent: number): void;
    dragThumbEnd(): void;
    //updateElement(name: string, value: any): void;
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
    changeHandler!: (object: TDragObject, number: number) => void;

    ifHorizontal!: boolean;
    ifRange!: boolean;
    currentFirstInPercents!: number;
    currentSecondInPercents!: number;
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
    stepValue!: number;
    maxValue!: number;
    minValue!: number;

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

        //booleans
        this.ifHorizontal = this.settings.orientation === "horizontal";
        this.ifRange = this.settings.range;
        this.ifTooltip = this.settings.tooltip;
        this.ifScale = this.settings.scale;

         //values in percents (comes from model with applied step)
        this.currentFirstInPercents = changeValueToPercents(this.settings.currentFirst, this.settings.max, this.settings.min);
        this.currentSecondInPercents = changeValueToPercents(this.settings.currentSecond, this.settings.max, this.settings.min);
        
        //actual values
        this.stepValue = this.settings.step;
        this.stepPerDiv = this.settings.scale.stepPerDiv;
        this.maxValue = this.settings.max;
        this.minValue = this.settings.min;
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
        this.fromViewSelectThumb.notify(e);
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
        if (this.dragObject === undefined || !this.dragObject.classList) return;
        e.preventDefault;
        this.fromViewDragThumb.notify(e);
    }

    dragThumbEnd(){
        this.dragObject = {};
        this.selectObject = {};
    }
    
    // in % and actual values
    сhange(object: TDragObject, newThumbCurrent: number){
        changeThumb(object, this.ifHorizontal, newThumbCurrent)

        let ifThumbFirst = (object === this.sliderThumb)
        changeRange(this.sliderRange, newThumbCurrent, this.ifHorizontal, this.ifRange, ifThumbFirst);
        
        if (this.ifTooltip) {
            (object.children[0] === this.tooltipFirst)
                ? changeTooltip(this.tooltipFirst, newThumbCurrent, this.maxValue, this.minValue)
                : changeTooltip(this.tooltipSecond, newThumbCurrent, this.maxValue, this.minValue)
        }
    }

    render(){
        this.parentContainer.innerHTML = "";
        //values in percents
        this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal, this.currentFirstInPercents, this.currentSecondInPercents);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal, this.currentFirstInPercents),
        this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal, this.currentSecondInPercents);
        if (!this.ifRange){ this.sliderThumbSecond.classList.add("disabled"); }

        //actual values
        this.tooltipFirst = tooltipItemView(this.sliderThumb, "tooltip_first", this.currentFirstInPercents, this.ifHorizontal, this.maxValue, this.minValue),
        this.tooltipSecond = tooltipItemView(this.sliderThumbSecond, "tooltip_second", this.currentSecondInPercents, this.ifHorizontal, this.maxValue, this.minValue)
        if (!this.ifRange){ this.tooltipSecond.classList.add("disabled"); }
        if (this.ifScale){ this.scale = scaleView(this.sliderContainer, this.ifHorizontal, this.maxValue, this.minValue,  this.stepValue, this.stepPerDiv); }
    }
}

export { IView, SliderView }