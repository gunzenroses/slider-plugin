import { fromValueToPX, getNumbersAfterDot, getTextWidth, valueToPercentsApplyStep } from 'utils/common';
import IView from 'Interfaces/IView';

class Scale {
  element!: HTMLElement;

  private scaleItemRow!: number[];

  private tailContainer!: number;

  private scaleLength!: number;

  private segmentClass!: string;

  private spanClass!: string;

  private newStep!: number;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that);
    this.change(that);
    that.container.append(this.element);
    return this.element;
  }

  private make(that: IView): HTMLElement {
    const scaleClass: Array<string> = that.settings.ifHorizontal
      ? ['scale']
      : ['scale', 'scale_vertical'];
    if (!that.settings.scale) {
      scaleClass.push('scale_disabled');
    }
    this.element = document.createElement('div');
    this.element.dataset.name = 'scale';
    scaleClass.forEach((item) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  private change(that: IView): HTMLElement {
    const toFixedDecimals = Math.max(
      getNumbersAfterDot(that.settings.min),
      getNumbersAfterDot(that.settings.step),
      getNumbersAfterDot(that.settings.max)
    );
    this.countContainerSize(that);
    this.countScaleStep(that, toFixedDecimals);
    this.makeScaleRow(that, toFixedDecimals);
    this.countDistanceBetweenLastItems(that);
    this.makeElementClasses(that);
    this.element.innerHTML =
      this.makeScaleItems(that) + this.makeMaxItem(that);
    return this.element;
  }

  private countContainerSize(that: IView): void {
    const parentNodeStyle = getComputedStyle(that.container);
    this.scaleLength = that.settings.ifHorizontal
      ? Math.ceil(parseFloat(parentNodeStyle.width))
      : Math.ceil(parseFloat(parentNodeStyle.height));
  }

  private countScaleStep(that: IView, toFixedDecimals: number): void {
    const widthOfMaxNumber =
      getTextWidth(
        (that.settings.max - that.settings.step).toFixed(toFixedDecimals),
        '16px TimesNewRoman'
      ) + 5;
    const widthOfMinNumber =
      getTextWidth(
        (that.settings.min + that.settings.step).toFixed(toFixedDecimals),
        '16px TimesNewRoman'
      ) + 5;
    const widthOfScaleNumber = Math.max(widthOfMaxNumber, widthOfMinNumber);
    const maxStepsToPlace = Math.floor(this.scaleLength / widthOfScaleNumber);
    const maxStepsCounted = Math.round(
      (that.settings.max - that.settings.min) / that.settings.step
    );
    const howManyTimesBigger = Math.ceil(maxStepsCounted / maxStepsToPlace);

    this.newStep =
      maxStepsCounted > maxStepsToPlace && howManyTimesBigger > 1
        ? howManyTimesBigger * that.settings.step
        : that.settings.step;
  }

  private makeScaleRow(that: IView, toFixedDecimals: number): void {
    this.scaleItemRow = [];
    if (this.newStep > 1) {
      let i = that.settings.min;
      while (i < that.settings.max) {
        i = parseFloat(i.toFixed(toFixedDecimals));
        this.scaleItemRow.push(i);
        i += this.newStep;
      }
    } else {
      this.scaleItemRow.push(that.settings.min, that.settings.max);
    }
  }

  private countDistanceBetweenLastItems(that: IView): void {
    const penultimateItem = this.scaleItemRow[this.scaleItemRow.length - 1];
    const lengthOfLeft = that.settings.max - penultimateItem;
    const leftLengthInPx = fromValueToPX({
      value: lengthOfLeft,
      data: that.settings,
      containerSize: this.scaleLength,
    });
    const newContainerSize = this.scaleLength - leftLengthInPx - 1;
    this.tailContainer = Math.floor(this.scaleLength - newContainerSize);
    console.log(this.tailContainer)
  }

  private makeElementClasses(that: IView): void {
    this.segmentClass = that.settings.ifHorizontal
      ? 'scale__segment'
      : 'scale__segment scale__segment_vertical';
    this.spanClass = that.settings.ifHorizontal
      ? 'scale__number'
      : 'scale__number scale__number_vertical';
  }

  private makeScaleItems(that: IView): string {
    const direction = that.settings.ifHorizontal ? 'left' : 'bottom';
    const settings = that.settings;
    return this.scaleItemRow
      .map((item) =>
        this.createScaleItem({ item, direction, settings })
      )
      .join(' ');
  }

  private createScaleItem(data: TScaleItemSettings): string {
    const { item, direction, settings } = data;
    const maxItem = this.scaleItemRow[this.scaleItemRow.length - 1];
    const notEnoughSpaceForMaxItem = this.tailContainer < 30;
    const itemIsMaxItem = item === maxItem;
    const distance = valueToPercentsApplyStep(item, settings);
    
    const segmentStyle: string =
      itemIsMaxItem && notEnoughSpaceForMaxItem
        ? 'visibility: hidden;'
        : `${direction}: ${distance}%`;

    return `
      <div class = '${this.segmentClass}' style = '${segmentStyle}'>
        <span class = '${this.spanClass}'>
          ${item}
        </span>
      </div>`;
  }

  private makeMaxItem(that: IView): string {
    const maxType: string = that.settings.ifHorizontal ? 'right' : 'top';
    const maxStyle = `position: absolute; ${maxType}: 0;`;
    const scaleItemMax = `
      <div class = '${this.segmentClass}' style = '${maxStyle}'>
        <span class = '${this.spanClass}'>
          ${that.settings.max}
        </span>
      </div>`;
    return scaleItemMax;
  }
}

export default Scale;
