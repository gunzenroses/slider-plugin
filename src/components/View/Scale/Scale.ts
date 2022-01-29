import { fromValueToPX, getNumbersAfterDot, getTextWidth } from 'utils/common';
import IView from 'interfaces/IView';

class Scale {
  element!: HTMLElement;

  private scaleItemRow!: number[];

  private tailContainer!: number;

  private scaleLength!: number;

  private scaleItems!: HTMLDivElement;

  private segmentClass!: string;

  private spanClass!: string;

  private itemWidth!: number;

  private maxItem!: number;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that);
    this.change(that);
    this.element.append(this.scaleItems);
    that.container.append(this.element);
    return this.element;
  }

  private make(that: IView): HTMLElement {
    const scaleClass: Array<string> = that.settings.ifHorizontal
      ? ['scale']
      : ['scale', 'scale_vertical'];
    if (!that.settings.scale) {
      scaleClass.push('js-disabled');
    }
    this.element = document.createElement('div');
    this.element.dataset.name = 'scale';
    scaleClass.forEach((item) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  private change(that: IView): HTMLElement {
    this.countContainerSize(that);
    this.makeScaleRow(that);
    this.makeScaleContainer(that);
    this.makeElementClasses(that);
    this.scaleItems.innerHTML = this.makeScaleItems() + this.makeMaxItem(that);
    return this.element;
  }

  private countContainerSize(that: IView): void {
    const parentNodeStyle = getComputedStyle(that.container);
    this.scaleLength = that.settings.ifHorizontal
      ? Math.ceil(parseFloat(parentNodeStyle.width))
      : Math.ceil(parseFloat(parentNodeStyle.height));
  }

  private makeScaleRow(that: IView): void {
    this.scaleItemRow = [];
    const toFixedDecimals = Math.max(
      getNumbersAfterDot(that.settings.min),
      getNumbersAfterDot(that.settings.step),
      getNumbersAfterDot(that.settings.max)
    );
    const newStep = this.countAmountOfSteps(that, toFixedDecimals);
    if (newStep > 1) {
      let i = that.settings.min;
      while (i < that.settings.max) {
        i = parseFloat(i.toFixed(toFixedDecimals));
        this.scaleItemRow.push(i);
        i += newStep;
      }
    } else {
      this.scaleItemRow.push(that.settings.min, that.settings.max);
    }
  }

  private countAmountOfSteps(that: IView, toFixedDecimals: number): number {
    const widthOfMaxNumber = getTextWidth(
      (that.settings.max - that.settings.step).toFixed(toFixedDecimals),
      '16px TimesNewRoman'
    ) + 5;
    const widthOfMinNumber = getTextWidth(
      (that.settings.min + that.settings.step).toFixed(toFixedDecimals),
      '16px TimesNewRoman'
    ) + 5;
    const widthOfScaleNumber = Math.max(widthOfMaxNumber, widthOfMinNumber);
    const maxStepsToPlace = Math.floor(this.scaleLength / widthOfScaleNumber);
    const maxStepsCounted = Math.round(
      (that.settings.max - that.settings.min) / that.settings.step
    );
    const howManyTimesBigger = Math.ceil(maxStepsCounted / maxStepsToPlace);
    const newStep = maxStepsCounted > maxStepsToPlace && howManyTimesBigger > 1
      ? howManyTimesBigger * that.settings.step
      : that.settings.step;

    return newStep;
  }

  private makeScaleContainer(that: IView): void {
    const penultimateItem = this.scaleItemRow[this.scaleItemRow.length - 1];
    const lengthOfLeft = that.settings.max - penultimateItem;
    const leftLengthInPx = fromValueToPX(
      lengthOfLeft,
      that.settings,
      this.scaleLength
    );
    const newContainerSize = this.scaleLength - leftLengthInPx - 1;
    this.tailContainer = Math.floor(this.scaleLength - newContainerSize);

    const scaleItemClass = that.settings.ifHorizontal
      ? ['scale__row']
      : ['scale__row', 'scale__row_vertical'];
    this.scaleItems = document.createElement('div');
    scaleItemClass.forEach((item) => this.scaleItems.classList.add(item));
    if (that.settings.ifHorizontal) {
      this.scaleItems.style.width = `${ newContainerSize }px`;
    } else {
      this.scaleItems.style.height = `${ newContainerSize }px`;
    }
  }

  private makeElementClasses(that: IView): void {
    this.segmentClass = that.settings.ifHorizontal
      ? 'scale__segment'
      : 'scale__segment scale__segment_vertical';
    this.spanClass = that.settings.ifHorizontal
      ? 'scale__number'
      : 'scale__number scale__number_vertical';
  }

  private makeScaleItems(): string {
    this.itemWidth = Math.round(this.scaleLength / this.scaleItemRow.length);
    this.maxItem = this.scaleItemRow[this.scaleItemRow.length - 1];

    return this.scaleItemRow
      .map((item) => this.createScaleItem(item))
      .join(' ');
  }

  private createScaleItem(item: number): string {
    const special: string = item === this.maxItem && this.tailContainer < 30
      ? 'style= "visibility: hidden;"'
      : '';
    return `
      <div class= '${ this.segmentClass }'>
        <span class= '${ this.spanClass }' ${ special }>
          ${ item }
        </span>
      </div>`;
  }

  private makeMaxItem(that: IView): string {
    const maxType: string = that.settings.ifHorizontal ? 'right' : 'top';
    const maxStyle = `position: absolute; ${ maxType }: 0;`;
    const scaleItemMax = `
      <div class= '${ this.segmentClass }' style= '${ maxStyle }'>
        <span class= '${ this.spanClass }'>
          ${ that.settings.max }
        </span>
      </div>`;
    return scaleItemMax;
  }
}

export default Scale;
