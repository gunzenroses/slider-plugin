import { EventDispatcher } from "./eventDispatcher";
import SliderContainer from "subview/trackView/sliderContainer/sliderContainer";
import SliderRange from "subview/trackView/sliderRange/sliderRange";
import SliderTrack from "subview/trackView/sliderTrack/sliderTrack";
import SliderThumb from "subview/trackView/sliderThumb/sliderThumb";
import SliderScale from "subview/scaleView/sliderScale";
import { changeValueToPercents } from "utils/common";
import { TSettings, TScale } from "utils/types";
import SliderTooltip from "subview/tooltipView/sliderTooltip";

interface IView {
  settings: TSettings;
  parentContainer: HTMLElement;
  sliderContainer: HTMLElement;
  sliderThumb: HTMLElement;
  sliderThumbSecond: HTMLElement;

  sliderTrack: HTMLElement;
  sliderRange: HTMLElement;
  scale: HTMLElement;
  tooltipFirst: HTMLElement;
  tooltipSecond: HTMLElement;

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
  sliderThumb!: HTMLElement;
  sliderThumbSecond!: HTMLElement;
  sliderRange!: HTMLElement;
  sliderTrack!: HTMLElement;
  tooltipRow!: HTMLElement;
  tooltipFirst!: HTMLElement;
  tooltipSecond!: HTMLElement;
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
      this.sliderThumb.addEventListener("pointerdown", this.dragThumbHandler);
      this.sliderThumbSecond.addEventListener("pointerdown", this.dragThumbHandler);
    } else {
      this.sliderThumb.addEventListener("pointerdown", this.dragThumbHandler);
    }
  }

  private stopListenDown(): void {
    this.sliderThumb.removeEventListener("pointerdown", this.dragThumbHandler);
    if (this.settings.range) {
      this.sliderThumbSecond.removeEventListener("pointerdown", this.dragThumbHandler);
    }
  }

  private listenMoveAndUp(): void {
    document.addEventListener("pointermove", this.moveThumbHandler);
    document.addEventListener("pointerup", this.dropThumbHandler);
  }

  private removeListenerPointerMoveAndUp(): void {
    document.removeEventListener("pointermove", this.moveThumbHandler);
    document.removeEventListener("pointerup", this.dropThumbHandler);
  }

  private selectThumb(e: MouseEvent): void {
    if (e.target === this.sliderThumb || e.target === this.sliderThumbSecond) return;
    this.fromViewSelectThumb.notify(e);
  }

  dragThumbStart(e: PointerEvent): void {
    e.preventDefault();
    if (e.target !== this.sliderThumb && e.target !== this.sliderThumbSecond) return;
    else {
      this.dragObject = <HTMLElement>e.target;
    }
    this.listenMoveAndUp();
  }

  private dragThumbMove(e: PointerEvent): void {
    if (this.dragObject === undefined || !this.dragObject.classList) return;
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
    object === this.sliderThumb
      ? (this.currentFirstInPercents = newThumbCurrent)
      : (this.currentSecondInPercents = newThumbCurrent);
    this.renderElements();
  }

  private renderElements() {
    this.sliderTrack.innerHTML = "";
    this.sliderRange = new SliderRange(this).sliderRange;
    this.ifRange ? this.renderDouble() : this.renderSingle();
  }

  private renderSingle() {
    this.sliderThumb = new SliderThumb(this, "thumb_first").sliderThumb;
    this.tooltipFirst = new SliderTooltip(this, "tooltip_first").tooltip;
  }

  private renderDouble() {
    this.sliderThumb = new SliderThumb(this, "thumb_first").sliderThumb;
    this.sliderThumbSecond = new SliderThumb(this, "thumb_second").sliderThumb;
    this.tooltipFirst = new SliderTooltip(this, "tooltip_first").tooltip;
    this.tooltipSecond = new SliderTooltip(this, "tooltip_second").tooltip;
  }

  private render(): void {
    this.parentContainer.innerHTML = "";
    this.sliderContainer = new SliderContainer(this).sliderContainer;
    this.sliderTrack = new SliderTrack(this).sliderTrack;
    this.scale = new SliderScale(this).scale;
    this.renderElements();
  }
}

export { IView, SliderView };
