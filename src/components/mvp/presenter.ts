import { IModel } from "./model";
import { IView } from "./view";
import { TSettings } from "utils/types";
import {
  applyRestrictions,
  findPosition,
  fromPercentsToValueApplyStep,
  changeValueToPercentsApplyStep,
} from "utils/common";
import { EventDispatcher } from "./eventDispatcher";

interface IPresenter {
  model: IModel;
  view: IView;
  containerId: string;
  data: TSettings;
  changingObject: HTMLElement;

  init(): void;
  updateView(): void;
  modelData(name: string, data: any): void;

  fromPresenterUpdate: EventDispatcher;
  fromPresenterThumbUpdate: EventDispatcher;
  fromPresenterThumbSecondUpdate: EventDispatcher;
}

class SliderPresenter implements IPresenter {
  model: IModel;
  view: IView;
  containerId: string;
  data!: TSettings;
  changingObject!: HTMLElement;

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
  fromViewSelectThumbHandler!: { (newThumbValue: number): void };
  fromViewDragThumbHandler!: { (newThumbValue: number): void };
  fromViewSortActionsHandler!: { (flag: string, event: Event): void };

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;
    this.containerId = this.model.getContainerId();
    this.fromPresenterUpdate = new EventDispatcher();
    this.fromPresenterThumbUpdate = new EventDispatcher();
    this.fromPresenterThumbSecondUpdate = new EventDispatcher();
    this.init();
  }

  init() {
    this.updateView();
    this.setupHandlers();
    this.enable();
  }

  // maybe join with init
  updateView() {
    this.data = this.model.getData();
    this.view.init(this.data);
    this.createChildren();
  }

  private createChildren() {
    this.min = this.data.min;
    this.max = this.data.max;
    this.step = this.data.step;
    this.ifHorizontal = this.data.orientation === "horizontal";
    this.ifRange = this.data.range;
    this.containerSize = this.ifHorizontal
      ? parseInt(
          getComputedStyle(this.view.sliderContainer).width.replace("px", "")
        )
      : parseInt(
          getComputedStyle(this.view.sliderContainer).height.replace("px", "")
        );
    this.thumbWidth = parseInt(
      getComputedStyle(this.view.sliderThumb).width.replace("px", "")
    );
  }

  private setupHandlers() {
    this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
    this.fromViewDragThumbHandler = this.dragThumb.bind(this);
    this.fromModelChangeViewHandler = this.updateThumbs.bind(this);
    this.fromModelUpdateDataHandler = this.updateData.bind(this);
    return this;
  }

  private enable() {
    this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
    this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);
    this.model.fromModelChangeView.add(this.fromModelChangeViewHandler);
    this.model.fromModelUpdateData.add(this.fromModelUpdateDataHandler);
    return this;
  }

  private setObject(object: HTMLElement) {
    this.changingObject = object;
  }

  //all values are in %
  private selectThumb(e: any) {
    let newThumbCurrentPosition = this.ifHorizontal
      ? e.clientX -
        this.view.sliderContainer.getBoundingClientRect().left +
        this.thumbWidth / 2
      : e.clientY - this.view.sliderContainer.getBoundingClientRect().top; //+ this.thumbWidth/2;
    let newThumbCurrentPercent = this.ifHorizontal
      ? Math.floor((newThumbCurrentPosition / this.containerSize) * 100)
      : Math.floor(
          ((this.containerSize - newThumbCurrentPosition) /
            this.containerSize) *
            100
        );
    let restrictedThumbCurrent = applyRestrictions(newThumbCurrentPercent);
    this.ifRange
      ? this.selectThumbRangeTrue(restrictedThumbCurrent)
      : this.selectThumbRangeFalse(restrictedThumbCurrent);
  }

  //all values are in %
  private selectThumbRangeFalse(newThumbCurrentPercent: number) {
    this.setObject(this.view.sliderThumb);
    this.modelThumbFirst(newThumbCurrentPercent);
  }

  //all values are in %
  private selectThumbRangeTrue(newThumbCurrentPercent: number) {
    let firstThumbPercent: number = findPosition(
      this.view.sliderThumb,
      this.ifHorizontal,
      this.containerSize
    );
    let secondThumbPercent: number = findPosition(
      this.view.sliderThumbSecond!,
      this.ifHorizontal,
      this.containerSize
    );

    let firstDiff: number = Math.abs(
      firstThumbPercent - newThumbCurrentPercent
    );
    let secondDiff: number = Math.abs(
      secondThumbPercent - newThumbCurrentPercent
    );

    if (firstDiff < secondDiff) {
      this.setObject(this.view.sliderThumb);
      this.modelThumbFirst(newThumbCurrentPercent);
    }
    if (firstDiff > secondDiff) {
      this.setObject(this.view.sliderThumbSecond!);
      this.modelThumbSecond(newThumbCurrentPercent);
    }
    if (firstDiff === secondDiff) {
      newThumbCurrentPercent < firstThumbPercent
        ? (this.setObject(this.view.sliderThumb),
          this.modelThumbFirst(newThumbCurrentPercent))
        : newThumbCurrentPercent > firstThumbPercent
        ? (this.setObject(this.view.sliderThumbSecond!),
          this.modelThumbSecond(newThumbCurrentPercent))
        : null;
    }
  }

  //all values are in %
  private dragThumb(e: any) {
    this.setObject(<HTMLElement>this.view.dragObject);
    let newThumbCurrentPX = this.ifHorizontal
      ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left
      : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
    let newThumbCurrent = this.ifHorizontal
      ? Math.floor((newThumbCurrentPX / this.containerSize) * 100)
      : Math.floor(
          ((this.containerSize - newThumbCurrentPX) / this.containerSize) * 100
        );
    let restrictedThumbCurrent = applyRestrictions(newThumbCurrent);
    this.ifRange
      ? this.dragThumbRangeTrue(restrictedThumbCurrent)
      : this.dragThumbRangeFalse(restrictedThumbCurrent);
  }

  //all values are in %
  private dragThumbRangeFalse(newThumbCurrent: number) {
    this.modelThumbFirst(newThumbCurrent);
  }

  //all values are in %
  private dragThumbRangeTrue(newThumbCurrent: number) {
    let firstThumbPercent = findPosition(
      this.view.sliderThumb,
      this.ifHorizontal,
      this.containerSize
    );
    let secondThumbPercent = findPosition(
      this.view.sliderThumbSecond!,
      this.ifHorizontal,
      this.containerSize
    );

    if (
      this.view.dragObject === this.view.sliderThumb &&
      newThumbCurrent <= secondThumbPercent + 1
    ) {
      this.modelThumbFirst(newThumbCurrent);
    } else if (
      this.view.dragObject === this.view.sliderThumbSecond &&
      newThumbCurrent >= firstThumbPercent + 1
    ) {
      this.modelThumbSecond(newThumbCurrent);
    }
  }

  //to update all kinds of data
  modelData(name: string, data: any) {
    this.model.setData(name, data);
  }

  //value - %, newValue - actual
  private modelThumbFirst(value: number) {
    let newValue = fromPercentsToValueApplyStep(
      value,
      this.max,
      this.min,
      this.step
    );
    this.model.changeThumb(newValue);
  }

  //value - %, newValue - actual
  private modelThumbSecond(value: number) {
    let newValue = fromPercentsToValueApplyStep(
      value,
      this.max,
      this.min,
      this.step
    );
    this.model.changeThumbSecond(newValue);
  }

  private updateData() {
    this.updateView();

    this.fromPresenterUpdate.notify();
  }

  //value - actual, newValue - %
  private updateThumbs(value: number) {
    this.changingObject === this.view.sliderThumb
      ? this.fromPresenterThumbUpdate.notify(value)
      : this.fromPresenterThumbSecondUpdate.notify(value);

    let newValue = changeValueToPercentsApplyStep(
      value,
      this.max,
      this.min,
      this.step
    );
    this.view.сhange(this.changingObject, newValue);
  }
}

export { IPresenter, SliderPresenter };
