 import { TModelData, TListener, TOrient, TSettings } from "Utils/types";
import {
  applyRestrictions,
  changePercentsToValue,
  findPosition,
} from "Utils/common";
import IModel from "Interfaces/IModel";
import IObservable from "Interfaces/IObservable";
import IPresenter from "Interfaces/IPresenter";
import IView from "Interfaces/IView";
import Model from "../Model/Model";
import Observable from "../Observable/Observable";
import View from "../View/View";

export default class Presenter implements IPresenter {
  model: IModel;
  view: IView;
  eventDispatcher: IObservable;

  data!: TSettings;
  changingObject!: HTMLElement | null;
  containerSize!: number;
  thumbWidth!: number;

  private ifHorizontal!: boolean;

  changeViewHandler!: { (value: number): void };
  updateDataHandler!: { (data: TSettings): void };
  selectThumbHandler!: { (e: PointerEvent): void };
  dragThumbHandler!: { (e: PointerEvent): void };

  constructor(container: HTMLElement, data: TSettings) {
    this.model = new Model(data);
    this.view = new View(container);
    this.eventDispatcher = new Observable();
    this.init();
  }

  init(): void {
    this.updateView();
    this.setupHandlers();
    this.enable();
  }

  updateView(): void {
    this.data = this.model.getData();
    this.view.init(this.data);
    this.createChildren();
  }

  private createChildren(): void {
    this.ifHorizontal = this.data.orientation === TOrient.HORIZONTAL;
    this.containerSize = this.ifHorizontal
      ? parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px", ""))
      : parseInt(getComputedStyle(this.view.sliderContainer).height.replace("px", ""));
    this.thumbWidth = parseInt(getComputedStyle(this.view.thumb.element).width.replace("px", ""));
  }

  private setupHandlers(): void {
    this.selectThumbHandler = this.selectThumb.bind(this);
    this.dragThumbHandler = this.dragThumb.bind(this);
    this.changeViewHandler = this.updateThumbs.bind(this);
    this.updateDataHandler = this.updateData.bind(this);
  }

  private enable(): void {
    this.view.eventDispatcher.add("selectThumb", this.selectThumbHandler);
    this.view.eventDispatcher.add("dragThumb", this.dragThumbHandler);
    this.model.eventDispatcher.add("changeView", this.changeViewHandler);
    this.model.eventDispatcher.add("updateData", this.updateDataHandler);
  }

  private setObject(object: HTMLElement): void {
    this.changingObject = object;
    object.style.zIndex = "4";
  }

  //all values are in %
  private selectThumb(e: PointerEvent): void {
    const pos = this.countPosition(e);
    this.data.range ? this.selectRangeTrue(pos) : this.selectThumbRangeFalse(pos);
  }

  private countPosition(e: PointerEvent): number {
    const newVal: number = this.ifHorizontal
      ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left + this.thumbWidth / 2
      : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
    const newPos: number = this.ifHorizontal
      ? Math.floor((newVal / this.containerSize) * 100)
      : Math.floor(((this.containerSize - newVal) / this.containerSize) * 100);
    return applyRestrictions(newPos);
  }

  //all values are in %
  private selectThumbRangeFalse(newPos: number): void {
    this.modelThumbFirst(newPos);
  }

  //all values are in %
  private selectRangeTrue(newPos: number): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    const firstDiff: number = Math.abs(firstThumbPercent - newPos);
    const secondDiff: number = Math.abs(secondThumbPercent - newPos);

    if (firstDiff < secondDiff && newPos < secondThumbPercent) {
      this.modelThumbFirst(newPos);
    }
    if (firstDiff > secondDiff && newPos > firstThumbPercent) {
      this.modelThumbSecond(newPos);
    }
    if (firstDiff === secondDiff) {
      this.findClosestThumb(newPos, firstThumbPercent);
    }
  }

  private countPercents() {
    const firstThumbPercent: number = findPosition(
      this.view.thumb.element,
      this.ifHorizontal,
      this.containerSize
    );
    const secondThumbPercent: number = findPosition(
      this.view.thumbSecond.element,
      this.ifHorizontal,
      this.containerSize
    );
    return { firstThumbPercent, secondThumbPercent };
  }

  private findClosestThumb(newPlace: number, thumbPlace: number): void {
    newPlace < thumbPlace ? this.modelThumbFirst(newPlace) : this.modelThumbSecond(newPlace);
  }

  //all values are in %
  private dragThumb(e: PointerEvent): void {
    const position = this.countPosition(e);
    this.data.range ? this.dragThumbRangeTrue(position) : this.dragThumbRangeFalse(position);
  }

  //all values are in %
  private dragThumbRangeFalse(newPos: number): void {
    this.modelThumbFirst(newPos);
  }

  //all values are in %
  private dragThumbRangeTrue(newPos: number): void {
    if (this.view.dragObj === null) return;
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    if (
      this.view.dragObj.classList === this.view.thumb.element.classList &&
      newPos <= secondThumbPercent - 1
    ) {
      this.modelThumbFirst(newPos);
    } else if (
      this.view.dragObj.classList === this.view.thumbSecond.element.classList &&
      newPos >= firstThumbPercent + 1
    ) {
      this.modelThumbSecond(newPos);
    }
  }

  //value - %, newValue - actual
  private modelThumbFirst(value: number): void {
    this.setObject(this.view.thumb.element);
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData("currentFirst", newValue);
  }

  //value - %, newValue - actual
  private modelThumbSecond(value: number): void {
    this.setObject(this.view.thumbSecond.element);
    const newValue = changePercentsToValue(value, this.data);
    this.model.setData("currentSecond", newValue);
  }

  //to update all kinds of data
  modelData(name: keyof TSettings, data: TModelData): void {
    this.model.setData(name, data);
  }

  private updateData(): void {
    this.updateView();
    this.eventDispatcher.notify("updateAll");
  }

  //value - actual, newValue - %
  private updateThumbs(value: number): void {
    this.changingObject === this.view.thumb.element
      ? this.eventDispatcher.notify("thumbUpdate", value)
      : this.eventDispatcher.notify("thumbSecondUpdate", value);

    this.view.change(<HTMLElement>this.changingObject, value);
  }
}

export { IPresenter, Presenter };
