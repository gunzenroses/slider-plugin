import { EventDispatcher, ISender } from "./eventDispatcher";
import SliderContainer from "subview/track/container/sliderContainer";
import Range from "subview/track/range/range";
import Track from "subview/track/track/track";
import Thumb from "subview/track/thumb/thumb";
import Scale from "subview/scale/scale";
import { changeValueToPercents } from "utils/common";
import { TSettings } from "utils/types";
import Tooltip from "subview/tooltip/tooltip";
import ISubview from "subview/subviewElement";

interface IView {
  settings: TSettings;
  sliderContainer: HTMLElement;
  thumb: ISubview;
  thumbSecond: ISubview;
  track: HTMLElement;
  range: ISubview;
  scale: HTMLElement;
  tooltipFirst: ISubview;
  tooltipSecond: ISubview;
  dragObj: HTMLElement | null;

  fromViewSelectThumb: ISender;
  fromViewDragThumb: ISender;

  init(settings: TSettings): void;
  change(object: HTMLElement, newThumbCurrent: number): void;
  selectThumb(e: PointerEvent): void;
  dragThumbStart(e: PointerEvent): void;
  dragThumbEnd(): void;
}

class View implements IView {
  //in constructor
  private parentContainer: HTMLElement;
  fromViewSelectThumb: ISender;
  fromViewDragThumb: ISender;

  //to manipulate the DOM
  settings!: TSettings;
  sliderContainer!: HTMLElement;
  thumb!: ISubview;
  thumbSecond!: ISubview;
  range!: ISubview;
  track!: HTMLElement;
  tooltipFirst!: ISubview;
  tooltipSecond!: ISubview;
  scale!: HTMLElement;
  dragObj!: HTMLElement | null;

  private selectThumbHandler!: { (ev: PointerEvent): void };
  private dragThumbHandler!: { (ev: PointerEvent): void };
  private moveThumbHandler!: { (ev: PointerEvent): void };
  private dropThumbHandler!: () => void;

  constructor(container: HTMLElement) {
    this.fromViewSelectThumb = new EventDispatcher();
    this.fromViewDragThumb = new EventDispatcher();
    this.parentContainer = container;
  }

  init(settings: TSettings): void {
    this.createSettings(settings);
    this.render();
    this.setupHandlers();
    this.enable();
  }

  private createSettings(settings: TSettings): void {
    this.settings = settings;
    this.settings.firstPosition = changeValueToPercents(settings.currentFirst, settings);
    this.settings.secondPosition = changeValueToPercents(settings.currentSecond, settings);
    this.settings.stepPerDiv = this.settings.scale.stepPerDiv;
    this.settings.ifHorizontal = this.settings.orientation === "horizontal";
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
    e.target !== this.thumb.element && e.target !== this.thumbSecond.element
      ? this.fromViewSelectThumb.notify(e)
      : null;
  }

  dragThumbStart(e: PointerEvent): void {
    this.dragObj = <HTMLElement>e.target;
    e.preventDefault();
    this.listenMoveAndUp();
  }

  private dragThumbMove(e: PointerEvent): void {
    this.stopListenDown();
    e.preventDefault();
    this.fromViewDragThumb.notify(e);
  }

  dragThumbEnd(): void {
    (this.dragObj as HTMLElement).style.zIndex = "3";
    this.removeListenerMoveAndUp();
    this.addListenerPointerDown();
  }

  // in % and actual values
  change(object: HTMLElement, newThumbCurrent: number): void {
    object === this.thumb.element
      ? (this.settings.firstPosition = newThumbCurrent)
      : (this.settings.secondPosition = newThumbCurrent);
    this.updateElements();
  }

  private updateElements(): void {
    this.range.change(this);
    this.settings.range ? this.renderDouble() : this.renderSingle();
  }

  private renderSingle(): void {
    this.thumb.change(this);
    this.tooltipFirst.change(this);
  }

  private renderDouble(): void {
    this.thumb.change(this);
    this.thumbSecond.change(this);
    this.tooltipFirst.change(this);
    this.tooltipSecond.change(this);
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
    this.updateElements();
  }
}

export { IView, View };
