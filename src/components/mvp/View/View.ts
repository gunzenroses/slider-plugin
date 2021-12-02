import { applyRestrictions, changeValueToPercents, findPosition, valueToPercentsApplyStep } from "Utils/common";
import { TOrient, TSettings, TViewSettings } from "Utils/types";
import IObservable from "Interfaces/IObservable";
import ISubview from "Interfaces/ISubview";
import IView from "Interfaces/IView";
import Observable from "../Observable/Observable";
import SliderContainer from "./SliderContainer/SliderContainer";
import Range from "./Range/Range";
import Track from "./Track/Track";
import Thumb from "./Thumb/Thumb";
import Scale from "./Scale/Scale";
import Tooltip from "./Tooltip/Tooltip";

export default class View implements IView {
  //in constructor
  private parentContainer: HTMLElement;
  eventDispatcher: IObservable;

  //to manipulate the DOM
  settings!: TViewSettings;
  sliderContainer!: HTMLElement;
  thumb!: ISubview;
  thumbSecond!: ISubview;
  range!: ISubview;
  track!: HTMLElement;
  tooltipFirst!: ISubview;
  tooltipSecond!: ISubview;
  scale!: HTMLElement;
  dragObj!: HTMLElement | null;
  containerSize!: number;
  thumbWidth!: number;

  private selectThumbHandler!: { (ev: PointerEvent): void };
  private dragThumbHandler!: { (ev: PointerEvent): void };
  private moveThumbHandler!: { (ev: PointerEvent): void };
  private dropThumbHandler!: () => void;

  constructor(container: HTMLElement) {
    this.eventDispatcher = new Observable();
    this.parentContainer = container;
  }

  init(settings: TSettings): void {
    this.createSettings(settings);
    this.render();
    this.createMetric();
    this.setupHandlers();
    this.enable();
  }

  private createSettings(settings: TSettings): void {
    const ifHorizontal = settings.orientation === TOrient.HORIZONTAL;
    const firstPosition = changeValueToPercents(settings.currentFirst, settings);
    const secondPosition = changeValueToPercents(settings.currentSecond, settings);
    this.settings = { ...settings, ifHorizontal, firstPosition, secondPosition };
  }

  private createMetric() {
    this.containerSize = this.settings.ifHorizontal
      ? parseInt(getComputedStyle(this.sliderContainer).width.replace("px", ""))
      : parseInt(getComputedStyle(this.sliderContainer).height.replace("px", ""));
    this.thumbWidth = parseInt(getComputedStyle(this.thumb.element).width.replace("px", ""));
  }

  private setupHandlers(): void {
    this.selectThumbHandler = this.selectThumb.bind(this);
    this.dragThumbHandler = this.dragThumbStart.bind(this);
    this.moveThumbHandler = this.dragThumbMove.bind(this);
    this.dropThumbHandler = this.dragThumbEnd.bind(this);
  }

  private enable(): void {
    this.sliderContainer.addEventListener("pointerup", this.selectThumbHandler);
    this.addListenerPointerDown();
  }

  private addListenerPointerDown(): void {
    if (this.settings.range) {
      this.thumb.element.addEventListener("pointerdown", this.dragThumbHandler);
      this.thumbSecond.element.addEventListener("pointerdown", this.dragThumbHandler);
    } else {
      this.thumb.element.addEventListener("pointerdown", this.dragThumbHandler);
    }
  }

  private stopListenDown(): void {
    if (this.settings.range === true) {
      this.thumb.element.removeEventListener("pointerdown", this.dragThumbHandler);
      this.thumbSecond.element.removeEventListener("pointerdown", this.dragThumbHandler);
    } else {
      this.thumb.element.removeEventListener("pointerdown", this.dragThumbHandler);
    }
  }

  private listenMoveAndUp(): void {
    this.sliderContainer.removeEventListener("pointerup", this.selectThumbHandler);
    document.addEventListener("pointermove", this.moveThumbHandler);
    document.addEventListener("pointerup", this.dropThumbHandler);
  }

  private removeListenerMoveAndUp(): void {
    this.sliderContainer.addEventListener("pointerup", this.selectThumbHandler);
    document.removeEventListener("pointermove", this.moveThumbHandler);
    document.removeEventListener("pointerup", this.dropThumbHandler);
  }

  selectThumb(e: PointerEvent): void {
    if (e.target === this.thumb.element || e.target === this.thumbSecond.element) return;
    const pos = this.countPosition(e);
    this.settings.range 
      ? this.selectRangeTrue(pos)
      : this.eventDispatcher.notify("firstThumb", pos);
  }

  //all values are in %
  private selectRangeTrue(newPos: number): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    const firstDiff: number = Math.abs(firstThumbPercent - newPos);
    const secondDiff: number = Math.abs(secondThumbPercent - newPos);

    if (firstDiff < secondDiff && newPos < secondThumbPercent) {
      this.eventDispatcher.notify("firstThumb", newPos);
    }
    if (firstDiff > secondDiff && newPos > firstThumbPercent) {
      this.eventDispatcher.notify("secondThumb", newPos);
    }
    if (firstDiff === secondDiff) {
      this.findClosestThumb(newPos, firstThumbPercent);
    }
  }

  private countPercents() {
    const firstThumbPercent: number = findPosition(
      this.thumb.element,
      this.settings.ifHorizontal,
      this.containerSize
    );
    const secondThumbPercent: number = findPosition(
      this.thumbSecond.element,
      this.settings.ifHorizontal,
      this.containerSize
    );
    return { firstThumbPercent, secondThumbPercent };
  }

  private findClosestThumb(newPlace: number, thumbPlace: number): void {
    newPlace < thumbPlace 
      ? this.eventDispatcher.notify("firstThumb", newPlace)
      : this.eventDispatcher.notify("secondThumb", newPlace);
  }

  private countPosition(e: PointerEvent): number {
    const newVal: number = this.settings.ifHorizontal
      ? e.clientX - this.sliderContainer.getBoundingClientRect().left + this.thumbWidth / 2
      : e.clientY - this.sliderContainer.getBoundingClientRect().top;
    const newPos: number = this.settings.ifHorizontal
      ? Math.floor((newVal / this.containerSize) * 100)
      : Math.floor(((this.containerSize - newVal) / this.containerSize) * 100);
    return applyRestrictions(newPos);
  }

  dragThumbStart(e: PointerEvent): void {
    if (!e.target) return;
    this.dragObj = e.target as HTMLElement;
    e.preventDefault();
    this.listenMoveAndUp();
  }

  private dragThumbMove(e: PointerEvent): void {
    this.stopListenDown();
    e.preventDefault();
    const pos = this.countPosition(e);
    // this.eventDispatcher.notify("dragThumb", e);
    this.settings.range 
      ? this.dragThumbRangeTrue(pos) 
      : this.eventDispatcher.notify("firstThumb", pos);
  }

  //all values are in %
  private dragThumbRangeTrue(newPos: number): void {
    if (this.dragObj === null) return;
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    if (
      this.dragObj.classList === this.thumb.element.classList &&
      newPos <= secondThumbPercent - 1
    ) {
      this.eventDispatcher.notify("firstThumb", newPos);
    } else if (
      this.dragObj.classList === this.thumbSecond.element.classList &&
      newPos >= firstThumbPercent + 1
    ) {
      this.eventDispatcher.notify("secondThumb", newPos);
    }
  }  

  dragThumbEnd(): void {
    if (this.dragObj === null) return;
    this.removeListenerMoveAndUp();
    this.addListenerPointerDown();
  }

  // in % and actual values
  change(object: HTMLElement, num: number): void {
    const newValue = valueToPercentsApplyStep(num, this.settings);
    object === this.thumb.element
      ? (this.settings.firstPosition = newValue,
        this.settings.currentFirst = num)
      : (this.settings.secondPosition = newValue,
        this.settings.currentSecond = num);
    this.eventDispatcher.notify("changeView", this);
  }

  changeFirstThumb(num: number) {
    const newValue = valueToPercentsApplyStep(num, this.settings);
    this.settings.firstPosition = newValue;
    this.settings.currentFirst = num;
    this.eventDispatcher.notify("changeView", this);
  }

  changeSecondThumb(num: number) {
    const newValue = valueToPercentsApplyStep(num, this.settings);
    this.settings.secondPosition = newValue;
    this.settings.currentSecond = num;
    this.eventDispatcher.notify("changeView", this);
  }

  private render(): void {
    this.parentContainer.innerHTML = "";
    this.sliderContainer = new SliderContainer(this, this.parentContainer).sliderContainer;
    this.track = new Track(this).element;
    this.scale = new Scale(this).element;
    this.range = new Range(this);
    this.thumb = new Thumb(this, "thumb_first");
    this.thumbSecond = new Thumb(this, "thumb_second");
    this.tooltipFirst = new Tooltip(this, "tooltip_first");
    this.tooltipSecond = new Tooltip(this, "tooltip_second");
  }
}

export { IView, View };
