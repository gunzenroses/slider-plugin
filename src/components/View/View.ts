import { boundMethod } from 'autobind-decorator';

import {
  applyRestrictions,
  changeValueToPercents,
  findPosition,
  valueToPercentsApplyStep
} from 'utils/common';
import { TOrient, TSettings, TViewSettings } from 'utils/types';
import IObservable from 'src/components/Interfaces/IObservable';
import IView from 'src/components/Interfaces/IView';
import Observable from 'Observable/Observable';
import Container from './Container/Container';
import Range from './Range/Range';
import Track from './Track/Track';
import Thumb from './Thumb/Thumb';
import Scale from './Scale/Scale';
import Tooltip from './Tooltip/Tooltip';

class View implements IView {
  eventDispatcher: IObservable;

  settings!: TViewSettings;

  container!: HTMLElement;

  thumb!: HTMLElement;

  thumbSecond!: HTMLElement;

  range!: HTMLElement;

  track!: HTMLElement;

  scale!: HTMLElement;

  tooltipFirst!: HTMLElement;

  tooltipSecond!: HTMLElement;

  containerSize!: number;

  thumbWidth!: number;

  private parentContainer: HTMLElement;

  private dragObj!: HTMLElement | null;

  constructor(container: HTMLElement) {
    this.eventDispatcher = new Observable();
    this.parentContainer = container;
  }

  init(settings: TSettings): void {
    this.createSettings(settings);
    this.render();
    this.createMetrics();
    this.enable();
  }

  enable(): void {
    this.container.addEventListener('pointerup', this.selectThumb);
    this.listenPointerDown();
  }

  @boundMethod
  selectThumb(e: PointerEvent): void {
    if (e.target === this.thumb || e.target === this.thumbSecond) return;
    const pos = this.countPosition(e);
    if (this.settings.range) {
      this.selectRangeTrue(pos);
    } else {
      this.eventDispatcher.notify('firstThumb', pos);
    }
  }

  @boundMethod
  dragThumbStart(e: PointerEvent): void {
    if (!e.target) return;
    this.dragObj = (e.target as HTMLElement).closest('.thumb');
    /* 'as' is used here
    cause eventTarget does not ihherit properties from Element like 'classList'
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
      this.eventDispatcher.notify('firstThumb', pos);
    }
  }

  @boundMethod
  dragThumbEnd(): void {
    if (this.dragObj === null) return;
    this.stopListenMoveAndUp();
    this.listenPointerDown();
  }

  changeFirstThumb(num: number): void {
    const newValue = valueToPercentsApplyStep(num, this.settings);
    this.thumb.style.zIndex = '4';
    this.thumbSecond.style.zIndex = '3';
    this.settings.firstPosition = newValue;
    this.settings.currentFirst = num;
    this.eventDispatcher.notify('changeView', this);
  }

  changeSecondThumb(num: number): void {
    const newValue = valueToPercentsApplyStep(num, this.settings);
    this.thumb.style.zIndex = '3';
    this.thumbSecond.style.zIndex = '4';
    this.settings.secondPosition = newValue;
    this.settings.currentSecond = num;
    this.eventDispatcher.notify('changeView', this);
  }

  private listenPointerDown(): void {
    const elements = this.settings.range
      ? [this.thumb, this.thumbSecond, this.tooltipFirst, this.tooltipSecond]
      : [this.thumb, this.tooltipFirst];
    elements.forEach(
      (element) => element.addEventListener('pointerdown', this.dragThumbStart)
    );
  }

  private stopListenPointerDown(): void {
    if (this.settings.range === true) {
      this.thumb.removeEventListener('pointerdown', this.dragThumbStart);
      this.thumbSecond.removeEventListener('pointerdown', this.dragThumbStart);
    } else {
      this.thumb.removeEventListener('pointerdown', this.dragThumbStart);
    }
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
      this.eventDispatcher.notify('firstThumb', newPos);
    }
    if (firstDiff > secondDiff && newPos > firstThumbPercent) {
      this.eventDispatcher.notify('secondThumb', newPos);
    }
    if (firstDiff === secondDiff) {
      this.findClosestThumb(newPos, firstThumbPercent);
    }
  }

  private countPercents(): {
    firstThumbPercent: number;
    secondThumbPercent: number;
    } {
    const firstThumbPercent: number = findPosition(
      this.thumb,
      this.settings.ifHorizontal,
      this.containerSize
    );
    const secondThumbPercent: number = findPosition(
      this.thumbSecond,
      this.settings.ifHorizontal,
      this.containerSize
    );
    return { firstThumbPercent, secondThumbPercent };
  }

  private findClosestThumb(newPlace: number, thumbPlace: number): void {
    if (newPlace < thumbPlace) {
      this.eventDispatcher.notify('firstThumb', newPlace);
    } else {
      this.eventDispatcher.notify('secondThumb', newPlace);
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
    if (
      this.dragObj.classList === this.thumb.classList
    ) {
      const value = newPos > secondThumbPercent ? secondThumbPercent : newPos;
      this.eventDispatcher.notify('firstThumb', value);
    } else if (
      this.dragObj.classList === this.thumbSecond.classList
    ) {
      const value = newPos < firstThumbPercent ? firstThumbPercent : newPos;
      this.eventDispatcher.notify('secondThumb', value);
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

  private createMetrics(): void {
    const containerMeasures = getComputedStyle(this.container);
    this.containerSize = this.settings.ifHorizontal
      ? parseInt(containerMeasures.width.replace('px', ''), 10)
      : parseInt(containerMeasures.height.replace('px', ''), 10);
    const thumbMeasures = getComputedStyle(this.thumb);
    this.thumbWidth = parseInt(thumbMeasures.width.replace('px', ''), 10);
  }

  private render(): void {
    this.parentContainer.innerHTML = '';
    this.container = new Container(
      this,
      this.parentContainer
    ).element;
    this.track = new Track(this).element;
    this.scale = new Scale(this).element;
    this.range = new Range(this).element;
    this.thumb = new Thumb(this, 'thumb_first').element;
    this.thumbSecond = new Thumb(this, 'thumb_second').element;
    this.tooltipFirst = new Tooltip(this, 'tooltip_first').element;
    this.tooltipSecond = new Tooltip(this, 'tooltip_second').element;
  }
}

export default View;
