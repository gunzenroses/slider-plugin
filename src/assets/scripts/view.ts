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

interface IView extends ISender {
    settings: TSettings;

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

    init(settings: TSettings): void;
    //createChildren(): void;
    //setupHandlers(): void;
    //enable(): void;
    render(): void;
    
    // selectThumb(e: MouseEvent): void;
    // dragThumbStart(e: MouseEvent): void;
    сhange(newThumbCurrent: number): void;
    changeThumbEnd(): void;
}

class SliderView extends EventDispatcher implements IView {
    parentContainer: HTMLElement;
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

    selectObject!: TDragObject; //{elem: EventTarget, offsetX: number} | {};
    thumbSecondPosition!: number;
    containerWidth!: number;

    selectThumbHandler!: { (ev: MouseEvent): void };
    dragThumbStartHandler!: { (ev: MouseEvent ): void };
    dragThumbMoveHandler!: { (ev: MouseEvent ): void };
    dragThumbEndHandler!: () => void;

    ifHorizontal!: boolean;
    ifRange!: boolean;
    ifTooltip!: boolean;
    ifScale!: boolean;
    step!: number;
    max!: number;
    min!: number;

    sliderRangeClass!: string;
    sliderTrackClass!: string;
    sliderThumbFirstClass!: string;
    sliderThumbSecondClass!: string;

    constructor(containerId: string){
        super();
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
        this.step = this.settings.step;
        this.max = this.settings.max;
        this.min = this.settings.min;
    }

    setupHandlers(){
        this.selectThumbHandler = this.selectThumb.bind(this);
        this.dragThumbStartHandler = this.dragThumbStart.bind(this);
        this.dragThumbMoveHandler = this.dragThumbMove.bind(this);
        this.dragThumbEndHandler = this.changeThumbEnd.bind(this);
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
        let flag = 'selectThumb';
        if (e.target === this.sliderThumb || 
            e.target === this.sliderThumbSecond) return;
        this.notify(flag, e);
    }
    
    dragThumbStart(e: MouseEvent){
        e.preventDefault;
        if (e.target !== this.sliderThumb &&
            e.target !== this.sliderThumbSecond)
            return;
        else {
            if (e.type === "mousedown"){
                let mouseEvent = e as MouseEvent;
                this.selectObject = e.target;
                // this.ifHorizontal
                //     ? this.selectObject.offset = mouseEvent.offsetX
                //     : this.selectObject.offset = mouseEvent.offsetY;
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
        if (!this.selectObject) return;
        let flag = 'dragThumb';
        this.notify(flag, e);
    }

    changeThumbEnd(){
        this.selectObject = {};
    }

    сhange(newThumbCurrent: number){
        //fix: validate newThumbCurrent to be 0 to 100?

        changeThumb(this.selectObject, this.ifHorizontal, newThumbCurrent)

        let ifThumbFirst = (this.selectObject === this.sliderThumb)
        changeRange(this.sliderRange, newThumbCurrent, this.ifHorizontal, this.ifRange, ifThumbFirst);
        
        if (this.ifTooltip) {
            let currentTooltip = this.selectObject.children[0];
            (currentTooltip === this.tooltipFirst)
                ? changeTooltip(this.tooltipFirst, newThumbCurrent, this.max, this.min)
                : changeTooltip(this.tooltipSecond, newThumbCurrent, this.max, this.min)
        }
    }

    render(){
        this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
        this.sliderContainer.innerHTML = "";
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal, this.max, this.min, this.step);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal, this.max, this.min, this.step)
        this.ifTooltip
            ? this.tooltipFirst = tooltipItemView(this.sliderThumb, this.ifHorizontal, "tooltip_first", this.settings.currentFirst, this.max, this.min, this.step)
            : null;
        this.ifRange
            ? (this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal, this.max, this.min, this.step),
                this.ifTooltip
                    ? this.tooltipSecond = tooltipItemView(this.sliderThumbSecond, this.ifHorizontal, "tooltip_second", this.settings.currentSecond, this.max, this.min, this.step)
                    : null)
            : null;
        this.ifScale
            ? (this.scale = scaleView(this.sliderContainer, this.ifHorizontal, this.settings.min, this.settings.max, this.settings.step))
            : null;
        return this;
    }
}

export { IView, SliderView }