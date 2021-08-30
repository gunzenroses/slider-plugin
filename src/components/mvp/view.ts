import { EventDispatcher } from "./eventDispatcher";
import SliderContainer from "subview/trackView/sliderContainer/sliderContainer";
import SliderRange from "subview/trackView/sliderRange/sliderRange";
import SliderTrack from "subview/trackView/sliderTrack/sliderTrack";
import SliderThumb from "subview/trackView/sliderThumb/sliderThumb";
import SliderScale from "subview/scaleView/sliderScale";
import { changeValueToPercents } from "utils/common";
import { TSettings, TScale } from "utils/types";
import SliderTooltip from "subview/tooltipView/sliderTooltip";
import ISubview from "subview/subviewElement";

interface IView {
  settings: TSettings;
  parentContainer: HTMLElement;
  sliderContainer: HTMLElement;
  sliderThumb: ISubview;
  sliderThumbSecond: ISubview;

  sliderTrack: HTMLElement;
  sliderRange: ISubview;
  scale: HTMLElement;
  tooltipFirst: ISubview;
  tooltipSecond: ISubview;

  fromViewSelectThumb: EventDispatcher;
  fromViewDragThumb: EventDispatcher;
  dragObject: HTMLElement;

  // data for rendering
  ifHorizontal: boolean;
  ifRange: boolean;
  ifTooltip: boolean;
  ifScale: boolean | TScale;
  currentFirstInPercents: number;
  currentSecondInPercents: number;
  stepValue: number;
  stepPerDiv: number;
  maxValue: number;
  minValue: number;

  init(settings: TSettings): void;
  change(object: HTMLElement, newThumbCurrent: number): void;
  dragThumbStart(e: PointerEvent): void;
  dragThumbEnd(): void;
}

class SliderView implements IView {
  //in constructor
  parentContainer: HTMLElement;
  fromViewSelectThumb: EventDispatcher;
  fromViewDragThumb: EventDispatcher;

  //to manipulate the DOM
  settings!: TSettings;
  sliderContainer!: HTMLElement;
  sliderThumb!: ISubview;
  sliderThumbSecond!: ISubview;
  sliderRange!: ISubview;
  sliderTrack!: HTMLElement;
  tooltipRow!: ISubview;
  tooltipFirst!: ISubview;
  tooltipSecond!: ISubview;
  scale!: HTMLElement;
  dragObject!: HTMLElement;

  private selectThumbHandler!: { (ev: MouseEvent): void };
  private dragThumbHandler!: { (ev: PointerEvent): void };
  private moveThumbHandler!: { (ev: PointerEvent): void };
  private dropThumbHandler!: () => void;
  changeHandler!: (object: HTMLElement, number: number) => void;

  //conditional variables for rendering
  ifHorizontal!: boolean;
  ifRange!: boolean;
  currentFirstInPercents!: number;
  currentSecondInPercents!: number;
  ifTooltip!: boolean;
  ifScale!: boolean | TScale;
  step!: number;
  max!: number;
  min!: number;

  //actual variables
  stepPerDiv!: number;
  stepValue!: number;
  maxValue!: number;
  minValue!: number;

  constructor(container: HTMLElement) {
    this.fromViewSelectThumb = new EventDispatcher();
    this.fromViewDragThumb = new EventDispatcher();
    this.parentContainer = container;
  }

  init(settings: TSettings): void {
    this.settings = settings;
    this.createChildren();
    this.render();
    this.setupHandlers();
    this.enable();
  }

  private createChildren(): void {
    //booleans
    this.ifHorizontal = this.settings.orientation === "horizontal";
    this.ifRange = this.settings.range;
    this.ifTooltip = this.settings.tooltip;
    this.ifScale = this.settings.scale;
    //values in percents (comes from model with applied step)
    this.currentFirstInPercents = changeValueToPercents(
      this.settings.currentFirst,
      this.settings.max,
      this.settings.min
    );
    this.currentSecondInPercents = changeValueToPercents(
      this.settings.currentSecond,
      this.settings.max,
      this.settings.min
    );
    //actual values
    this.stepValue = this.settings.step;
    if (!this.stepPerDiv) {
      const scale = <TScale>this.settings.scale;
      this.stepPerDiv = scale.stepPerDiv;
    }
    this.maxValue = this.settings.max;
    this.minValue = this.settings.min;
  }

  private setupHandlers(): void {
    this.selectThumbHandler = this.selectThumb.bind(this);
    this.dragThumbHandler = this.dragThumbStart.bind(this);
    this.moveThumbHandler = this.dragThumbMove.bind(this);
    this.dropThumbHandler = this.dragThumbEnd.bind(this);
    this.changeHandler = this.change.bind(this);
  }

  private enable(): void {
    this.sliderContainer.addEventListener("click", this.selectThumbHandler);
    this.addListenerPointerDown();
  }

  private addListenerPointerDown(): void {
    if (this.settings.range) {
      this.sliderThumb.element.addEventListener("pointerdown", this.dragThumbHandler);
      this.sliderThumbSecond.element.addEventListener("pointerdown", this.dragThumbHandler);
    } else {
      this.sliderThumb.element.addEventListener("pointerdown", this.dragThumbHandler);
    }
  }

  private stopListenDown(): void {
    if (this.settings.range === true) {
      this.sliderThumb.element.removeEventListener("pointerdown", this.dragThumbHandler);
      this.sliderThumbSecond.element.removeEventListener("pointerdown", this.dragThumbHandler);
    } else {
      this.sliderThumb.element.removeEventListener("pointerdown", this.dragThumbHandler);
    }
  }

  private listenMoveAndUp(): void {
    this.sliderContainer.removeEventListener("click", this.selectThumbHandler);
    document.addEventListener("pointermove", this.moveThumbHandler);
    document.addEventListener("pointerup", this.dropThumbHandler);
  }

  private removeListenerPointerMoveAndUp(): void {
    this.sliderContainer.addEventListener("click", this.selectThumbHandler);
    document.removeEventListener("pointermove", this.moveThumbHandler);
    document.removeEventListener("pointerup", this.dropThumbHandler);
  }

  private selectThumb(e: MouseEvent): void {
    e.target !== this.sliderThumb.element && e.target !== this.sliderThumbSecond.element
      ? this.fromViewSelectThumb.notify(e)
      : null;
  }

  dragThumbStart(e: PointerEvent): void {
    e.preventDefault();
    e.target === this.sliderThumb.element || e.target === this.sliderThumbSecond.element
      ? (this.dragObject = <HTMLElement>e.target)
      : null;
    this.listenMoveAndUp();
  }

  private dragThumbMove(e: PointerEvent): void {
    if (this.dragObject === undefined || !(this.dragObject as HTMLElement).classList) return;
    this.stopListenDown();
    e.preventDefault();
    this.fromViewDragThumb.notify(e);
  }

  dragThumbEnd(): void {
    this.removeListenerPointerMoveAndUp();
    this.addListenerPointerDown();
  }

  // in % and actual values
  change(object: HTMLElement, newThumbCurrent: number): void {
    object === this.sliderThumb.element
      ? (this.currentFirstInPercents = newThumbCurrent)
      : (this.currentSecondInPercents = newThumbCurrent);
    this.updateElements();
  }

  private updateElements() {
    this.sliderRange.change(this);
    this.ifRange ? this.renderDouble() : this.renderSingle();
  }

  private renderSingle() {
    this.sliderThumb.change(this);
    this.tooltipFirst.change(this);
  }

  private renderDouble() {
    this.sliderThumb.change(this);
    this.sliderThumbSecond.change(this);
    this.tooltipFirst.change(this);
    this.tooltipSecond.change(this);
  }

  private render(): void {
    this.parentContainer.innerHTML = "";
    this.sliderContainer = new SliderContainer(this).sliderContainer;
    this.sliderTrack = new SliderTrack(this).sliderTrack;
    this.scale = new SliderScale(this).scale;

    this.sliderRange = new SliderRange(this);
    this.sliderThumb = new SliderThumb(this, "thumb_first");
    this.sliderThumbSecond = new SliderThumb(this, "thumb_second");
    this.tooltipFirst = new SliderTooltip(this, "tooltip_first");
    this.tooltipSecond = new SliderTooltip(this, "tooltip_second");
    this.updateElements();
  }
}

export { IView, SliderView };
