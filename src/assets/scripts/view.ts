import { EventDispatcher } from "./eventDispatcher"
import { TSettings } from "./types/types"
import { sliderContainerView } from "./subview/trackView/sliderContainer/sliderContainerView"
import { sliderTrackView } from "./subview/trackView/sliderTrack/sliderTrackView"
import { sliderThumbView } from "./subview/trackView/sliderThumb/slideThumbView"
import { sliderRangeView } from "./subview/trackView/sliderRange/sliderRangeView"
import { tooltipItemView } from "./subview/tooltipView/tooltipItemView"
import { scaleView } from "./subview/scaleView/scaleView"

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

    // selectThumb(ev: MouseEvent): object | undefined;
    // dragThumbStart(ev: MouseEvent): object | undefined;
    // dragThumbMove(ev: MouseEvent): object | undefined;
    // dragThumbEnd(): object;

    // changeThumb(object: object, newThumbCurrent: number): object;
    // changeRange(object: object, newThumbCurrent: number): object;
    // changeTooltop(object: object, newThumbCurrent: number): object;
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
        this.changeThumb(object, newThumbCurrent);
        this.changeRange(object, newThumbCurrent);
        if (this.ifTooltip) this.changeTooltip(object, newThumbCurrent);
        return this;
    }

    changeThumb(object: any, newThumbCurrent: number){
        this.ifHorizontal
                    ? object.style.left = newThumbCurrent + "%"
                    : object.style.top = newThumbCurrent + "%";
        return this;
    }

    changeRange(object: object, newThumbCurrent: number){
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

    changeTooltip(object: HTMLElement, newThumbCurrent: number){
        let currentTooltip = object.children[0];
        (currentTooltip === this.tooltipFirst)
            ? this.tooltipFirst.innerText =  Math.round(newThumbCurrent * (this.settings.max - this.settings.min) / 100).toString()
            : this.tooltipSecond.innerText = Math.round(newThumbCurrent * (this.settings.max - this.settings.min) / 100).toString();
        return this;
    }


    render(){
        this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
        this.sliderContainer.innerHTML = "";
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal)
        this.ifTooltip
            ? this.tooltipFirst = tooltipItemView(this.sliderThumb, this.ifHorizontal, "tooltip_first", this.settings.currentFirst, this.max, this.step)
            : null;
        this.ifRange
            ? (this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal),
                this.ifTooltip
                    ? this.tooltipSecond = tooltipItemView(this.sliderThumbSecond, this.ifHorizontal, "tooltip_second", this.settings.currentSecond, this.max, this.step)
                    : null)
            : null;
        this.ifScale
            ? (this.scale = scaleView(this.sliderContainer, this.ifHorizontal, this.settings.min, this.settings.max, this.settings.step))
            : null;
        return this;
    }
}

export { IView, SliderView }