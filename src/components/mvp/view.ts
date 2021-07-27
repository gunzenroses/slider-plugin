import { EventDispatcher } from "./eventDispatcher"
import { TSettings, TDragObject } from "../../scripts/utils/types"
import sliderContainerView from "../subview/trackView/sliderContainer/sliderContainerView"
import sliderTrackView from "../subview/trackView/sliderTrack/sliderTrackView"
import sliderThumbView from "../subview/trackView/sliderThumb/slideThumbView"
import changeThumb from "../subview/trackView/sliderThumb/changeThumb"
import sliderRangeView from "../subview/trackView/sliderRange/sliderRangeView"
import changeRange from "../subview/trackView/sliderRange/changeRange"
import tooltipItemView from "../subview/tooltipView/tooltipItemView"
import changeTooltip from "../subview/tooltipView/changeTooltip"
import scaleView from "../subview/scaleView/scaleView"
import { changeValueToPercents } from "../../scripts/utils/common"

interface IView {
    settings: TSettings;
    sliderContainer: HTMLElement;
    sliderThumb: HTMLElement;
    sliderThumbSecond: HTMLElement;
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;
    selectObject: TDragObject;
    dragObject: TDragObject;

    init(settings: TSettings): void;
    сhange(object: TDragObject, newThumbCurrent: number): void;
    dragThumbEnd(): void;
}

class SliderView implements IView {
    //in constructor
    parentContainer: HTMLElement;
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;

    //to manipulate DOM
    settings!: TSettings;
    sliderContainer!: HTMLElement;
    sliderThumb!: HTMLElement;
    sliderThumbSecond!: HTMLElement;
    sliderRange!: HTMLElement;
    sliderTrack!: HTMLElement;
    tooltipRow!: HTMLElement;
    tooltipFirst!: HTMLElement;
    tooltipSecond!: HTMLElement;
    scale!: HTMLElement;

    //maintain select/drag
    selectObject!: TDragObject;
    dragObject!: TDragObject;

    private selectThumbHandler!: { (ev: MouseEvent): void };
    private dragThumbStartHandler!: { (ev: PointerEvent ): void };
    private dragThumbMoveHandler!: { (ev: PointerEvent ): void };
    private dragThumbEndHandler!: () => void;
    changeHandler!: (object: TDragObject, number: number) => void;

    //conditional variables for rendering
    ifHorizontal!: boolean;
    ifRange!: boolean;
    currentFirstInPercents!: number;
    currentSecondInPercents!: number;
    ifTooltip!: boolean;
    ifScale!: boolean;
    step!: number;
    max!: number;
    min!: number;

    //actual variables
    stepPerDiv!: number;
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

    private createChildren(){
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
        this.stepPerDiv = (this.stepPerDiv) 
            ? this.stepPerDiv
            : this.settings.scale.stepPerDiv;
        this.maxValue = this.settings.max;
        this.minValue = this.settings.min;
    }

    private setupHandlers(){
        this.selectThumbHandler = this.selectThumb.bind(this);
        this.dragThumbStartHandler = this.dragThumbStart.bind(this);
        this.dragThumbMoveHandler = this.dragThumbMove.bind(this);
        this.dragThumbEndHandler = this.dragThumbEnd.bind(this);
        this.changeHandler = this.сhange.bind(this);
    }

    private enable(){
        this.sliderContainer.addEventListener("click", this.selectThumbHandler);
        this.sliderThumb.addEventListener("pointerdown", this.dragThumbStartHandler);
        if (this.settings.range){ 
            this.sliderThumbSecond.addEventListener("pointerdown", this.dragThumbStartHandler);
        };
        document.addEventListener("pointermove", this.dragThumbMoveHandler);
        document.addEventListener("pointerup", this.dragThumbEndHandler);
    }

    private selectThumb(e: MouseEvent){
        if (e.target === this.sliderThumb || 
            e.target === this.sliderThumbSecond) return;
        this.fromViewSelectThumb.notify(e);
    }
    
    private dragThumbStart(e: PointerEvent){
        e.preventDefault();
        if (e.target !== this.sliderThumb &&
            e.target !== this.sliderThumbSecond)
            return;
        else {
            // (e.target === this.sliderThumb )
            //     ? this.sliderThumb.setPointerCapture(e.pointerId)
            //     : this.sliderThumbSecond.setPointerCapture(e.pointerId);
            
            this.dragObject = e.target;
        }

    }

    private dragThumbMove(e: PointerEvent){
        if (this.dragObject === undefined || !this.dragObject.classList) return;
        e.preventDefault();
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

    private render(){
        this.parentContainer.innerHTML = "";
        //values in percents
        this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal, this.currentFirstInPercents, this.currentSecondInPercents);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal, this.currentFirstInPercents),
        this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal, this.currentSecondInPercents);
        if (!this.ifRange){ this.sliderThumbSecond.classList.add("disabled"); }

        //actual values
        this.scale = scaleView(this.sliderContainer, this.ifHorizontal, this.maxValue, this.minValue,  this.stepValue, this.stepPerDiv);
        this.tooltipFirst = tooltipItemView(this.sliderThumb, "tooltip_first", this.currentFirstInPercents, this.ifHorizontal, this.maxValue, this.minValue);
        this.tooltipSecond = tooltipItemView(this.sliderThumbSecond, "tooltip_second", this.currentSecondInPercents, this.ifHorizontal, this.maxValue, this.minValue);
        

        if (!this.ifScale){
            this.scale.classList.add("disabled");
        }
        
        if (!this.ifTooltip){ 
            this.tooltipFirst.classList.add("disabled");
            this.tooltipSecond.classList.add("disabled");
        }
        if (!this.ifRange){ this.tooltipSecond.classList.add("disabled"); }
        
    }
}

export { IView, SliderView }