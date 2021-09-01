import { IModel } from "./model";
import { IView } from "./view";
import { EventDispatcher } from "./eventDispatcher";
import { IModelData, TFunc, TSettings } from "utils/types";
import {
  applyRestrictions,
  findPosition,
  percentsToValueApplyStep,
  valueToPercentsApplyStep,
} from "utils/common";

interface IPresenter {
  model: IModel;
  view: IView;
  container: HTMLElement;
  data: TSettings;
  changingObject: HTMLElement | null;

  init(): void;
  updateView(): void;
  modelData(name: string, data: IModelData): void;

  fromPresenterUpdate: EventDispatcher;
  fromPresenterThumbUpdate: EventDispatcher;
  fromPresenterThumbSecondUpdate: EventDispatcher;
}

class SliderPresenter implements IPresenter {
  model: IModel;
  view: IView;
  container: HTMLElement;
  data!: TSettings;
  changingObject!: HTMLElement | null;

  fromPresenterUpdate!: EventDispatcher;
  fromPresenterThumbUpdate!: EventDispatcher;
  fromPresenterThumbSecondUpdate!: EventDispatcher;

  private min!: number;
  private max!: number;
  private step!: number;

  private ifHorizontal!: boolean;
  private ifRange!: boolean;
  containerSize!: number;
  thumbWidth!: number;

  fromModelChangeViewHandler!: { (newThumbValue: number): void };
  fromModelUpdateDataHandler!: { (data: TSettings): void };
  fromViewSelectThumbHandler!: { (e: PointerEvent): void };
  fromViewDragThumbHandler!: { (e: PointerEvent): void };
  fromViewSortActionsHandler!: { (flag: string, event: Event): void };

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;
    this.container = this.model.getContainer();
    this.fromPresenterUpdate = new EventDispatcher();
    this.fromPresenterThumbUpdate = new EventDispatcher();
    this.fromPresenterThumbSecondUpdate = new EventDispatcher();
    this.init();
  }

  init(): void {
    this.updateView();
    this.setupHandlers();
    this.enable();
  }

  // maybe join with init
  updateView(): void {
    this.data = this.model.getData();
    this.view.init(this.data);
    this.createChildren();
  }

  private createChildren(): void {
    this.min = this.data.min;
    this.max = this.data.max;
    this.step = this.data.step;
    this.ifHorizontal = this.data.orientation === "horizontal";
    this.ifRange = this.data.range;
    this.containerSize = this.ifHorizontal
      ? parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px", ""))
      : parseInt(getComputedStyle(this.view.sliderContainer).height.replace("px", ""));
    this.thumbWidth = parseInt(
      getComputedStyle(this.view.sliderThumb.element).width.replace("px", "")
    );
  }

  private setupHandlers(): void {
    this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
    this.fromViewDragThumbHandler = this.dragThumb.bind(this);
    this.fromModelChangeViewHandler = this.updateThumbs.bind(this);
    this.fromModelUpdateDataHandler = this.updateData.bind(this);
  }

  private enable(): void {
    this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler as TFunc);
    this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler as TFunc);
    this.model.fromModelChangeView.add(this.fromModelChangeViewHandler as TFunc);
    this.model.fromModelUpdateData.add(this.fromModelUpdateDataHandler as TFunc);
  }

  private setObject(object: HTMLElement): void {
    this.changingObject = object;
    object.style.zIndex = "4";
  }

  //all values are in %
  private selectThumb(e: PointerEvent): void {
    const position = this.countPosition(e);
    this.ifRange ? this.selectThumbRangeTrue(position) : this.selectThumbRangeFalse(position);
  }

  private countPosition(e: PointerEvent) {
    const newThumbCurrentPosition = this.ifHorizontal
      ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left + this.thumbWidth / 2
      : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
    const newThumbCurrent = this.ifHorizontal
      ? Math.floor((newThumbCurrentPosition / this.containerSize) * 100)
      : Math.floor(((this.containerSize - newThumbCurrentPosition) / this.containerSize) * 100);
    return applyRestrictions(newThumbCurrent);
  }

  //all values are in %
  private selectThumbRangeFalse(newThumbCurrentPercent: number): void {
    this.modelThumbFirst(newThumbCurrentPercent);
  }

  //all values are in %
  private selectThumbRangeTrue(newPercent: number): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    const firstDiff: number = Math.abs(firstThumbPercent - newPercent);
    const secondDiff: number = Math.abs(secondThumbPercent - newPercent);

    if (firstDiff < secondDiff && newPercent < secondThumbPercent) {
      this.modelThumbFirst(newPercent);
    }
    if (firstDiff > secondDiff && newPercent > firstThumbPercent) {
      this.modelThumbSecond(newPercent);
    }
    if (firstDiff === secondDiff) {
      this.findClosestThumb(newPercent, firstThumbPercent);
    }
  }

  private countPercents() {
    const firstThumbPercent: number = findPosition(
      this.view.sliderThumb.element,
      this.ifHorizontal,
      this.containerSize
    );
    const secondThumbPercent: number = findPosition(
      this.view.sliderThumbSecond.element,
      this.ifHorizontal,
      this.containerSize
    );
    return { firstThumbPercent, secondThumbPercent };
  }

  private findClosestThumb(newPlace: number, firstThumbPlace: number): void {
    newPlace < firstThumbPlace
      ? this.modelThumbFirst(newPlace)
      : newPlace > firstThumbPlace
      ? this.modelThumbSecond(newPlace)
      : null;
  }

  //all values are in %
  dragThumb(e: PointerEvent): void {
    const position = this.countPosition(e);
    this.ifRange ? this.dragThumbRangeTrue(position) : this.dragThumbRangeFalse(position);
  }

  //all values are in %
  private dragThumbRangeFalse(newThumbCurrent: number): void {
    this.modelThumbFirst(newThumbCurrent);
  }

  //all values are in %
  private dragThumbRangeTrue(newThumbCurrent: number): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    if (
      this.view.dragObj === this.view.sliderThumb.element &&
      newThumbCurrent <= secondThumbPercent - 1
    ) {
      this.modelThumbFirst(newThumbCurrent);
    } else if (
      this.view.dragObj === this.view.sliderThumbSecond.element &&
      newThumbCurrent >= firstThumbPercent + 1
    ) {
      this.modelThumbSecond(newThumbCurrent);
    }
  }

  //to update all kinds of data
  modelData(name: string, data: IModelData): void {
    this.model.setData(name, data);
  }

  //value - %, newValue - actual
  private modelThumbFirst(value: number): void {
    this.setObject(this.view.sliderThumb.element);
    const newValue = percentsToValueApplyStep(value, this.max, this.min, this.step);
    this.model.changeThumb(newValue);
  }

  //value - %, newValue - actual
  private modelThumbSecond(value: number): void {
    this.setObject(this.view.sliderThumbSecond.element);
    const newValue = percentsToValueApplyStep(value, this.max, this.min, this.step);
    this.model.changeThumbSecond(newValue);
  }

  private updateData(): void {
    this.updateView();
    this.fromPresenterUpdate.notify();
  }

  //value - actual, newValue - %
  private updateThumbs(value: number): void {
    this.changingObject === this.view.sliderThumb.element
      ? this.fromPresenterThumbUpdate.notify(value)
      : this.fromPresenterThumbSecondUpdate.notify(value);

    const newValue = valueToPercentsApplyStep(value, this.max, this.min, this.step);
    this.view.change(<HTMLElement>this.changingObject, newValue);
  }
}

export { IPresenter, SliderPresenter };
