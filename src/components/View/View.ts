import { boundMethod } from 'autobind-decorator';

import {
  applyRestrictions,
  changeValueToPercents,
  findPosition,
  valueToPercentsApplyStep
} from 'utils/common';
import TOrient from 'utils/const';
import IView from 'Interfaces/IView';
import Observable from 'Observable/Observable';
import Range from './Range/Range';
import Track from './Track/Track';
import Thumbs from './Thumbs/Thumbs';
import Scale from './Scale/Scale';

class View extends Observable implements IView {
  container: HTMLElement;

  settings!: TViewSettings;

  track!: HTMLElement;

  scale!: HTMLElement;

  range!: TRange;

  thumbs!: TThumbs;

  containerSize!: number;

  thumbWidth!: number;

  private dragObj!: HTMLElement | null;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
  }

  init(settings: TSettings): void {
    this.createSettings(settings);
    this.render();
    this.createMetrics();
    this.enable();
  }

  enable(): void {
    this.container.addEventListener('pointerup', this.selectThumb);
    window.addEventListener('resize', this.createMetrics);
    this.listenPointerDown();
  }

  @boundMethod
  selectThumb(e: PointerEvent): void {
    if (e.target === this.thumbs.thumbFirst || e.target === this.thumbs.thumbSecond) return;
    const pos = this.countPosition(e);
    if (this.settings.range) {
      this.selectRangeTrue(pos);
    } else {
      this.notifyListener('firstThumb', pos);
    }
  }

  @boundMethod
  dragThumbStart(e: PointerEvent): void {
    if (!e.target) return;
    this.dragObj = (e.target as HTMLElement).closest('.thumb');
    /* 'as' is used here
    cause eventTarget does not inherit properties from Element like 'classList'
    (not all targets are elements),
    but in our case (event happened on a DOM Element) it is */
    e.preventDefault();
    this.listenMoveAndUp();
  }

  @boundMethod
  dragThumbMove(e: PointerEvent): void {
    this.stopListenPointerDown();
    e.preventDefault();
    const pos = this.countPosition(e);
    if (this.settings.range) {
      this.dragThumbRangeTrue(pos);
    } else {
      this.notifyListener('firstThumb', pos);
    }
  }

  @boundMethod
  dragThumbEnd(): void {
    if (this.dragObj === null) return;
    this.stopListenMoveAndUp();
    this.listenPointerDown();
  }

  changeThumb(name: string, value: number): void {
    const { min, max, step } = this.settings;
    const newValue = valueToPercentsApplyStep({
      value, min, max, step
    });
    if (name === 'thumbFirst') {
      this.thumbs.thumbFirst.classList.add('thumb_active');
      this.thumbs.thumbSecond.classList.remove('thumb_active');
      this.settings.firstPosition = newValue;
      this.settings.currentFirst = value;
    } else {
      this.thumbs.thumbSecond.classList.add('thumb_active');
      this.thumbs.thumbFirst.classList.remove('thumb_active');
      this.settings.secondPosition = newValue;
      this.settings.currentSecond = value;
    }
    const newSettings = this.settings;
    this.notifySubviews(newSettings);
  }

  private notifySubviews(data: TViewSettings) {
    this.range.change(data);
    this.thumbs.change(data);
  };

  private listenPointerDown(): void {
    this.thumbs.listenPointerDown(this.settings.range, this.dragThumbStart);
  }

  private stopListenPointerDown(): void {
    this.thumbs.stopListenPointerDown(this.settings.range, this.dragThumbStart);
  }

  private listenMoveAndUp(): void {
    this.container.removeEventListener('pointerup', this.selectThumb);
    document.addEventListener('pointermove', this.dragThumbMove);
    document.addEventListener('pointerup', this.dragThumbEnd);
  }

  private stopListenMoveAndUp(): void {
    this.container.addEventListener('pointerup', this.selectThumb);
    document.removeEventListener('pointermove', this.dragThumbMove);
    document.removeEventListener('pointerup', this.dragThumbEnd);
  }

  private selectRangeTrue(newPos: number): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    const firstDiff: number = Math.abs(firstThumbPercent - newPos);
    const secondDiff: number = Math.abs(secondThumbPercent - newPos);
    if (firstDiff < secondDiff && newPos < secondThumbPercent) {
      this.notifyListener('firstThumb', newPos);
    }
    if (firstDiff > secondDiff && newPos > firstThumbPercent) {
      this.notifyListener('secondThumb', newPos);
    }
    if (firstDiff === secondDiff) {
      this.findClosestThumb(newPos, firstThumbPercent);
    }
  }

  private countPercents(): {
    firstThumbPercent: number;
    secondThumbPercent: number;
  } {
    const firstThumbPercent: number = findPosition({
      thisElement: this.thumbs.thumbFirst,
      ifHorizontal: this.settings.ifHorizontal,
      containerSize: this.containerSize
    });
    const secondThumbPercent: number = findPosition({
      thisElement: this.thumbs.thumbSecond,
      ifHorizontal: this.settings.ifHorizontal,
      containerSize: this.containerSize
    });
    return { firstThumbPercent, secondThumbPercent };
  }

  private findClosestThumb(newPlace: number, thumbPlace: number): void {
    if (newPlace < thumbPlace) {
      this.notifyListener('firstThumb', newPlace);
    } else {
      this.notifyListener('secondThumb', newPlace);
    }
  }

  private countPosition(e: PointerEvent): number {
    const containerClientRect = this.container.getBoundingClientRect();
    const newVal: number = this.settings.ifHorizontal
      ? e.clientX - containerClientRect.left + this.thumbWidth / 2
      : e.clientY - containerClientRect.top;
    const newPos: number = this.settings.ifHorizontal
      ? Math.floor((newVal / this.containerSize) * 100)
      : Math.floor(((this.containerSize - newVal) / this.containerSize) * 100);
    return applyRestrictions(newPos);
  }

  private dragThumbRangeTrue(newPos: number): void {
    if (this.dragObj === null) return;
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    if (this.dragObj.classList === this.thumbs.thumbFirst.classList) {
      const value = newPos > secondThumbPercent ? secondThumbPercent : newPos;
      this.notifyListener('firstThumb', value);
    } else if (this.dragObj.classList === this.thumbs.thumbSecond.classList) {
      const value = newPos < firstThumbPercent ? firstThumbPercent : newPos;
      this.notifyListener('secondThumb', value);
    }
  }

  private createSettings(settings: TSettings): void {
    this.deleteKey('updateSubViews');
    const ifHorizontal = settings.orientation === TOrient.HORIZONTAL;
    const firstPosition = changeValueToPercents(
      settings.currentFirst,
      settings
    );
    const secondPosition = changeValueToPercents(
      settings.currentSecond,
      settings
    );
    this.settings = {
      ...settings,
      ifHorizontal,
      firstPosition,
      secondPosition
    };
  }

  @boundMethod
  private createMetrics(): void {
    const containerMeasures = getComputedStyle(this.container);
    this.containerSize = this.settings.ifHorizontal
      ? parseInt(containerMeasures.width.replace('px', ''), 10)
      : parseInt(containerMeasures.height.replace('px', ''), 10);
    const thumbMeasures = getComputedStyle(this.thumbs.thumbFirst);
    this.thumbWidth = parseInt(thumbMeasures.width.replace('px', ''), 10);
  }

  private render(): void {
    this.renderParentContainer();
    const container = document.createDocumentFragment();
    this.track = new Track(container, this.settings.ifHorizontal).element;
    this.scale = new Scale(
      container,
      this.settings,
      this.container
    ).element;
    const trackElementsData: TSubviewData = {
      container: this.track,
      settings: this.settings
    };
    this.range = new Range(trackElementsData);
    this.thumbs = new Thumbs(trackElementsData);
    this.container.append(container);
  }

  private renderParentContainer(): void {
    this.container.innerHTML = '';
    this.container.classList.add('slider');
    if (this.settings.ifHorizontal) {
      this.container.classList.remove('slider_vertical');
    } else {
      this.container.classList.add('slider_vertical');
    }
  }
}

export default View;
