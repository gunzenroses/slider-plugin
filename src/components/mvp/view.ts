import { EventDispatcher, ISender } from "./eventDispatcher";
import SliderContainer from "subview/trackView/sliderContainer/sliderContainer";
import SliderRange from "subview/trackView/sliderRange/sliderRange";
import SliderTrack from "subview/trackView/sliderTrack/sliderTrack";
import SliderThumb from "subview/trackView/sliderThumb/sliderThumb";
import SliderScale from "subview/scaleView/sliderScale";
import { changeValueToPercents } from "utils/common";
import { TSettings } from "utils/types";
import SliderTooltip from "subview/tooltipView/sliderTooltip";
import ISubview from "subview/subviewElement";

interface IView {
  settings: TSettings;
  sliderContainer: HTMLElement;
  sliderThumb: ISubview;
  sliderThumbSecond: ISubview;
  sliderTrack: HTMLElement;
  sliderRange: ISubview;
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

class SliderView implements IView {
  //in constructor
  private parentContainer: HTMLElement;
  fromViewSelectThumb: ISender;
  fromViewDragThumb: ISender;

  //to manipulate the DOM
  settings!: TSettings;
  sliderContainer!: HTMLElement;
  sliderThumb!: ISubview;
  sliderThumbSecond!: ISubview;
  sliderRange!: ISubview;
  sliderTrack!: HTMLElement;
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
    e.target !== this.sliderThumb.element && e.target !== this.sliderThumbSecond.element
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
    object === this.sliderThumb.element
      ? (this.settings.firstPosition = newThumbCurrent)
      : (this.settings.secondPosition = newThumbCurrent);
    this.updateElements();
  }

  private updateElements(): void {
    this.sliderRange.change(this);
    this.settings.range ? this.renderDouble() : this.renderSingle();
  }

  private renderSingle(): void {
    this.sliderThumb.change(this);
    this.tooltipFirst.change(this);
  }

  private renderDouble(): void {
    this.sliderThumb.change(this);
    this.sliderThumbSecond.change(this);
    this.tooltipFirst.change(this);
    this.tooltipSecond.change(this);
  }

  private render(): void {
    this.parentContainer.innerHTML = "";
    this.sliderContainer = new SliderContainer(this, this.parentContainer).sliderContainer;
    this.sliderTrack = new SliderTrack(this).element;
    this.scale = new SliderScale(this).element;

    this.sliderRange = new SliderRange(this);
    this.sliderThumb = new SliderThumb(this, "thumb_first");
    this.sliderThumbSecond = new SliderThumb(this, "thumb_second");
    this.tooltipFirst = new SliderTooltip(this, "tooltip_first");
    this.tooltipSecond = new SliderTooltip(this, "tooltip_second");
    this.updateElements();
  }
}

export { IView, SliderView };
