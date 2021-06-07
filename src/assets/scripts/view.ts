import { EventDispatcher } from "./eventDispatcher"
import { TSettings } from "./types/types"
import { sliderTrackView } from "./subview/trackView/sliderTrack/sliderTrackView"
import { sliderThumbView } from "./subview/trackView/sliderThumb/slideThumbView"
import { sliderRangeView } from "./subview/trackView/sliderRange/sliderRangeView"
import { tooltipRowView } from "./subview/tooltipView/tooltipRowView"
import { tooltipItemView } from "./subview/tooltipView/tooltipItemView"

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

    sliderContainer: HTMLElement;
    sliderThumb: HTMLElement;
    sliderThumbSecond?: HTMLElement;
    sliderRange: HTMLElement;
    sliderTrack: HTMLElement;
    tooltipRow?: HTMLElement;
    tooltipFirst?: HTMLElement;
    tooltipSecond?: HTMLElement;

    selectObject: any; //HTMLElement;

    //selectThumb(ev: MouseEvent): object | undefined;
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
    tooltipRow!: HTMLElement;
    tooltipFirst!: HTMLElement;
    tooltipSecond!: HTMLElement;

    ifHorizontal!: boolean;
    ifRange!: boolean;
    ifTooltip!: boolean;

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
        this.sliderContainer.classList.add(
                                    this.ifHorizontal 
                                        ? "slider__content" 
                                        : "slider__content_vertical");
        this.ifTooltip
            ?   (
                    this.tooltipRow = tooltipRowView( this.sliderContainer, this.ifHorizontal),
                    this.tooltipFirst = tooltipItemView(this.tooltipRow, this.ifHorizontal, "tooltip_first", this.settings.currentFirst),
                    this.ifRange 
                        ?  this.tooltipSecond = tooltipItemView(this.tooltipRow, this.ifHorizontal, "tooltip_second", this.settings.currentSecond)
                        : null
                )
            : null;
        this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
        this.sliderRange = sliderRangeView(this.sliderTrack, this.ifRange, this.ifHorizontal);
        this.sliderThumb = sliderThumbView(this.sliderTrack, "thumb_first", this.ifHorizontal)
        this.ifRange
            ? this.sliderThumbSecond = sliderThumbView(this.sliderTrack, "thumb_second", this.ifHorizontal)
            : "";
        return this;
    }
}

export { IView, SliderView }