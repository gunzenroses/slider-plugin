import { IModel, SliderModel } from "./model";
import { IView, SliderView } from "./view";
import { EventDispatcher, ISender } from "./eventDispatcher";
import { IModelData, TFunc, TSettings } from "utils/types";
import {
  applyRestrictions,
  findPosition,
  percentsToValue,
  valueToPercentsApplyStep,
} from "utils/common";

interface IPresenter {
  model: IModel;
  view: IView;
  data: TSettings;
  changingObject: HTMLElement | null;

  init(): void;
  modelData(name: string, data: IModelData): void;

  fromPresenterUpdate: ISender;
  fromPresenterThumbUpdate: ISender;
  fromPresenterThumbSecondUpdate: ISender;
}

class SliderPresenter implements IPresenter {
  model: IModel;
  view: IView;
  data!: TSettings;
  changingObject!: HTMLElement | null;
  containerSize!: number;
  thumbWidth!: number;

  fromPresenterUpdate!: ISender;
  fromPresenterThumbUpdate!: ISender;
  fromPresenterThumbSecondUpdate!: ISender;

  private ifHorizontal!: boolean;

  fromModelChangeViewHandler!: { (value: number): void };
  fromModelUpdateDataHandler!: { (data: TSettings): void };
  fromViewSelectThumbHandler!: { (e: PointerEvent): void };
  fromViewDragThumbHandler!: { (e: PointerEvent): void };

  constructor(container: HTMLElement, data: TSettings) {
    this.model = new SliderModel(data);
    this.view = new SliderView(container);
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
    this.ifHorizontal = this.data.orientation === "horizontal";
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
    const pos = this.countPosition(e);
    this.data.range ? this.selectRangeTrue(pos) : this.selectThumbRangeFalse(pos);
  }

  private countPosition(e: PointerEvent) {
    const newVal = this.ifHorizontal
      ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left + this.thumbWidth / 2
      : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
    const newPos = this.ifHorizontal
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
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    if (
      (this.view.dragObj as HTMLElement).classList === this.view.sliderThumb.element.classList &&
      newPos <= secondThumbPercent - 1
    ) {
      this.modelThumbFirst(newPos);
    } else if (
      (this.view.dragObj as HTMLElement).classList ===
        this.view.sliderThumbSecond.element.classList &&
      newPos >= firstThumbPercent + 1
    ) {
      this.modelThumbSecond(newPos);
    }
  }

  //value - %, newValue - actual
  private modelThumbFirst(value: number): void {
    this.setObject(this.view.sliderThumb.element);
    const newValue = percentsToValue(value, this.data);
    this.model.setData("currentFirst", newValue);
  }

  //value - %, newValue - actual
  private modelThumbSecond(value: number): void {
    this.setObject(this.view.sliderThumbSecond.element);
    const newValue = percentsToValue(value, this.data);
    this.model.setData("currentSecond", newValue);
  }

  //to update all kinds of data
  modelData(name: string, data: IModelData): void {
    this.model.setData(name, data);
  }

  private updateData(): void {
    this.updateView();
    this.fromPresenterUpdate.notify();
  }

  //value - actual, newValue - %
  private updateThumbs(value: number): void {
    this.changingObject === this.view.sliderThumb.element
      ? this.fromPresenterThumbUpdate.notify(value.toString())
      : this.fromPresenterThumbSecondUpdate.notify(value.toString());

    const newValue = valueToPercentsApplyStep(value, this.data);
    this.view.change(<HTMLElement>this.changingObject, newValue);
  }
}

export { IPresenter, SliderPresenter };
