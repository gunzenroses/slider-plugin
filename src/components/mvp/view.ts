import { EventDispatcher } from "./eventDispatcher";
import sliderContainerView from "subview/trackView/sliderContainer/sliderContainerView";
import sliderTrackView from "subview/trackView/sliderTrack/sliderTrackView";
import sliderThumbView from "subview/trackView/sliderThumb/slideThumbView";
import changeThumb from "subview/trackView/sliderThumb/changeThumb";
import sliderRangeView from "subview/trackView/sliderRange/sliderRangeView";
import changeRange from "subview/trackView/sliderRange/changeRange";
import tooltipItemView from "subview/tooltipView/tooltipItemView";
import changeTooltip from "subview/tooltipView/changeTooltip";
import scaleView from "subview/scaleView/scaleView";
import { changeValueToPercents } from "utils/common";
import { TSettings, TScale } from "utils/types";

interface IView {
  settings: TSettings;
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
    this.sliderThumb.addEventListener("pointerdown", this.dragThumbHandler);
    if (this.settings.range) {
      this.sliderThumbSecond.addEventListener("pointerdown", this.dragThumbHandler);
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

  private dragThumbStart(e: PointerEvent): void {
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
    changeThumb(object, this.ifHorizontal, newThumbCurrent);

    const ifThumbFirst = object === this.sliderThumb;
    changeRange(this.sliderRange, newThumbCurrent, this.ifHorizontal, this.ifRange, ifThumbFirst);

    if (this.ifTooltip) {
      object.children[0] === this.tooltipFirst
        ? changeTooltip(this.tooltipFirst, newThumbCurrent, this.maxValue, this.minValue)
        : changeTooltip(this.tooltipSecond, newThumbCurrent, this.maxValue, this.minValue);
    }
  }

  private render(): void {
    this.parentContainer.innerHTML = "";
    //values in percents
    this.sliderContainer = sliderContainerView(this.parentContainer, this.ifHorizontal);
    this.sliderTrack = sliderTrackView(this.sliderContainer, this.ifHorizontal);
    this.sliderRange = sliderRangeView(
      this.sliderTrack,
      this.ifRange,
      this.ifHorizontal,
      this.currentFirstInPercents,
      this.currentSecondInPercents
    );
    (this.sliderThumb = sliderThumbView(
      this.sliderTrack,
      "thumb_first",
      this.ifHorizontal,
      this.currentFirstInPercents
    )),
      (this.sliderThumbSecond = sliderThumbView(
        this.sliderTrack,
        "thumb_second",
        this.ifHorizontal,
        this.currentSecondInPercents
      ));
    if (!this.ifRange) {
      this.sliderThumbSecond.classList.add("disabled");
    }

    //actual values
    this.scale = scaleView(
      this.sliderContainer,
      this.ifHorizontal,
      this.maxValue,
      this.minValue,
      this.stepValue,
      this.stepPerDiv
    );
    this.tooltipFirst = tooltipItemView(
      this.sliderThumb,
      "tooltip_first",
      this.currentFirstInPercents,
      this.ifHorizontal,
      this.maxValue,
      this.minValue
    );
    this.tooltipSecond = tooltipItemView(
      this.sliderThumbSecond,
      "tooltip_second",
      this.currentSecondInPercents,
      this.ifHorizontal,
      this.maxValue,
      this.minValue
    );

    if (!this.ifScale) {
      this.scale.classList.add("disabled");
    }

    if (!this.ifTooltip) {
      this.tooltipFirst.classList.add("disabled");
      this.tooltipSecond.classList.add("disabled");
    }
    if (!this.ifRange) {
      this.tooltipSecond.classList.add("disabled");
    }
  }
}

export { IView, SliderView };
