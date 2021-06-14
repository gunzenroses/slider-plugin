import { EventDispatcher } from "./eventDispatcher"
import { TSettings } from "./types/types"
import { sliderContainerView } from "./subview/trackView/sliderContainer/sliderContainerView"
import { sliderTrackView } from "./subview/trackView/sliderTrack/sliderTrackView"
import { sliderThumbView } from "./subview/trackView/sliderThumb/slideThumbView"
import { changeThumb } from "./subview/trackView/sliderThumb/changeThumb"
import { sliderRangeView } from "./subview/trackView/sliderRange/sliderRangeView"
import { changeRange } from "./subview/trackView/sliderRange/changeRange"
import { tooltipItemView } from "./subview/tooltipView/tooltipItemView"
import { changeTooltip } from "./subview/tooltipView/changeTooltip"
import { scaleView } from "./subview/scaleView/scaleView"
import { fromPercentsToValue } from "./common"

interface IView {
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;

    containerId: string;
    settings: TSettings;
    dragObject: TSettings;

    init(containerId: string, settings: TSettings): object;
    createChildren(containerId: string): object;
    setupHandlers(): object;
    enable(): object;
    render(): void;
    fromPresenterChange(object: any, newThumbCurrent: number): object;

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

    selectObject: any; //HTMLElement;
}


class SliderView implements IView {
    fromViewSelectThumb: EventDispatcher;
    fromViewDragThumb: EventDispatcher;
    parentContainer: HTMLElement;
    
    sliderContainer!: HTMLElement;
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
    tooltipRow!: HTMLElement;
    tooltipFirst!: HTMLElement;
    tooltipSecond!: HTMLElement;
    scale!: HTMLElement;

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

    selectObject!: any; //HTMLElement;

    constructor(containerId: string){
        this.fromViewSelectThumb = new EventDispatcher(this)
        this.fromViewDragThumb = new EventDispatcher(this)
        this.parentContainer = document.getElementById(containerId)!;
    }

    init(containerId: string, settings: TSettings){
        this.containerId = containerId;
        this.settings = settings;
        this.createChildren();
        this.render();
        this.setupHandlers();
        this.enable();
        return this;
    }

    createChildren(){
        this.dragObject = {};
        this.ifHorizontal = this.settings.orientation === "horizontal";
        this.ifRange = this.settings.range;
        this.ifTooltip = this.settings.tooltip;
        this.ifScale = this.settings.scale;
        this.step = this.settings.step;
        this.max = this.settings.max;
        this.min = this.settings.min;
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

    fromPresenterChange(object: any, newThumbCurrent: number){
        changeThumb(object, this.ifHorizontal, newThumbCurrent)

        let ifThumbFirst = (object === this.sliderThumb)
        changeRange(this.sliderRange, newThumbCurrent, this.ifHorizontal, this.ifRange, ifThumbFirst);
        
        if (this.ifTooltip) {
            let currentTooltip = object.children[0];
            (currentTooltip === this.tooltipFirst)
                ? changeTooltip(this.tooltipFirst, newThumbCurrent, this.max, this.min)
                : changeTooltip(this.tooltipSecond, newThumbCurrent, this.max, this.min)
        }
        return this;
    }

    render(){
        this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
        this.sliderContainer.innerHTML = "";
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal, this.max, this.step);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal, this.max, this.step)
        this.ifTooltip
            ? this.tooltipFirst = tooltipItemView(this.sliderThumb, this.ifHorizontal, "tooltip_first", this.settings.currentFirst, this.max, this.min, this.step)
            : null;
        this.ifRange
            ? (this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal, this.max, this.step),
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