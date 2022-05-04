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
import Thumb from './Thumb/Thumb';
import Scale from './Scale/Scale';

class View extends Observable<TViewObservable> implements IView {
  container: HTMLElement;

  settings!: TViewSettings;

  track!: HTMLElement;

  scale!: HTMLElement;

  range!: TRange;

  thumbFirst!: Thumb;

  thumbSecond!: Thumb;

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
    this.thumbFirst.addListener('dragThumb', this.dragThumb);
    this.thumbSecond.addListener('dragThumb', this.dragThumb);
  }

  @boundMethod
  selectThumb(e: PointerEvent): void {
    if (e.target === this.thumbFirst.element || e.target === this.thumbSecond.element) return;
    const pos = this.countPosition(e);
    if (this.settings.range) {
      this.selectRangeTrue(pos);
    } else {
      this.notifyListener('changeFirstThumb', pos);
    }
  }

  @boundMethod
  dragThumb(e: PointerEvent): void {
    let target;
    if (e.target instanceof HTMLElement) {
      target = e.target.closest('.thumb');
    }
    const pos = this.countPosition(e);
    if (this.settings.range && target instanceof HTMLElement) {
      this.dragThumbRangeTrue(pos, target);
    } else if (!this.settings.range) {
      this.notifyListener('changeFirstThumb', pos);
    }
  }

  changeThumb(name: string, value: number): void {
    const { min, max, step } = this.settings;
    const newValue = valueToPercentsApplyStep({
      value, min, max, step
    });
    if (name === 'thumbFirst') {
      this.thumbFirst.element.classList.add('thumb_active');
      this.thumbSecond.element.classList.remove('thumb_active');
      this.settings.firstPosition = newValue;
      this.settings.currentFirst = value;
    } else {
      this.thumbSecond.element.classList.add('thumb_active');
      this.thumbFirst.element.classList.remove('thumb_active');
      this.settings.secondPosition = newValue;
      this.settings.currentSecond = value;
    }
    const newSettings = this.settings;
    this.changeSubviews(newSettings);
  }

  private changeSubviews(data: TViewSettings) {
    this.range.change(data);
    this.thumbFirst.change(data, 'first');
    if (this.range){
      this.thumbSecond.change(data, 'second');
    }
  }

  private selectRangeTrue(newPos: number): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    const firstDiff: number = Math.abs(firstThumbPercent - newPos);
    const secondDiff: number = Math.abs(secondThumbPercent - newPos);
    if (firstDiff < secondDiff && newPos < secondThumbPercent) {
      this.notifyListener('changeFirstThumb', newPos);
    }
    if (firstDiff > secondDiff && newPos > firstThumbPercent) {
      this.notifyListener('changeSecondThumb', newPos);
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
      thisElement: this.thumbFirst.element,
      ifHorizontal: this.settings.ifHorizontal,
      containerSize: this.containerSize
    });
    const secondThumbPercent: number = findPosition({
      thisElement: this.thumbSecond.element,
      ifHorizontal: this.settings.ifHorizontal,
      containerSize: this.containerSize
    });
    return { firstThumbPercent, secondThumbPercent };
  }

  private findClosestThumb(newPlace: number, thumbPlace: number): void {
    if (newPlace < thumbPlace) {
      this.notifyListener('changeFirstThumb', newPlace);
    } else {
      this.notifyListener('changeSecondThumb', newPlace);
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

  private dragThumbRangeTrue(newPos: number, target: HTMLElement): void {
    const { firstThumbPercent, secondThumbPercent } = this.countPercents();
    if (target === this.thumbFirst.element) {
      const value = newPos > secondThumbPercent ? secondThumbPercent : newPos;
      this.notifyListener('changeFirstThumb', value);
    } else if (target === this.thumbSecond.element) {
      const value = newPos < firstThumbPercent ? firstThumbPercent : newPos;
      this.notifyListener('changeSecondThumb', value);
    }
  }

  private createSettings(settings: TSettings): void {
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
    const thumbMeasures = getComputedStyle(this.thumbFirst.element);
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
    this.thumbFirst = new Thumb(trackElementsData, 'first');
    if (this.range) {
      this.thumbSecond = new Thumb(trackElementsData, 'second');
    }
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
