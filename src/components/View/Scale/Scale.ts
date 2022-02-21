import {
  fromValueToPX, getNumbersAfterDot, getTextWidth, valueToPercentsApplyStep
} from 'utils/common';

class Scale {
  element!: HTMLElement;

  private scaleItemRow!: number[];

  private parentContainer!: HTMLElement;

  private tailContainer!: number;

  private scaleLength!: number;

  private segmentClass!: string;

  private spanClass!: string;

  private newStep!: number;

  constructor(
    container: DocumentFragment,
    settings: TViewSettings,
    parentContainer: HTMLElement
  ) {
    this.init(container, settings, parentContainer);
  }

  private init(
    container: DocumentFragment,
    settings: TViewSettings,
    parentContainer: HTMLElement
  ): HTMLElement {
    this.parentContainer = parentContainer;
    this.make(settings);
    this.change(settings);
    container.append(this.element);
    return this.element;
  }

  private make(data: TViewSettings): HTMLElement {
    const { scale, ifHorizontal } = data;
    const scaleClass: Array<string> = ifHorizontal
      ? ['scale']
      : ['scale', 'scale_vertical'];
    if (!scale) {
      scaleClass.push('scale_disabled');
    }
    this.element = document.createElement('div');
    this.element.dataset.name = 'scale';
    scaleClass.forEach((item) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  private change(data: TViewSettings): HTMLElement {
    const {
      min, max, step, ifHorizontal
    } = data;
    const toFixedDecimals = Math.max(
      getNumbersAfterDot(min),
      getNumbersAfterDot(step),
      getNumbersAfterDot(max)
    );
    const scaleItemData = {
      ifHorizontal,
      min,
      max,
      step,
      toFixedDecimals
    };
    this.countContainerSize(this.parentContainer, ifHorizontal);
    this.countScaleStep(scaleItemData);
    this.makeScaleRow(scaleItemData);
    this.countDistanceBetweenLastItems(min, max);
    this.makeElementClasses(ifHorizontal);
    this.element.innerHTML = this.makeScaleItems(scaleItemData)
      + this.makeMaxItem(ifHorizontal, max);
    return this.element;
  }

  private countContainerSize(
    parentContainer: HTMLElement,
    ifHorizontal: boolean
  ): void {
    const parentNodeStyle = getComputedStyle(parentContainer);
    this.scaleLength = ifHorizontal
      ? Math.ceil(parseFloat(parentNodeStyle.width))
      : Math.ceil(parseFloat(parentNodeStyle.height));
  }

  private countScaleStep(data: TScaleItemData): void {
    const {
      min, max, step, toFixedDecimals
    } = data;
    const widthOfMaxNumber = getTextWidth(
      (max - step).toFixed(toFixedDecimals),
      '16px TimesNewRoman'
    ) + 5;
    const widthOfMinNumber = getTextWidth(
      (min + step).toFixed(toFixedDecimals),
      '16px TimesNewRoman'
    ) + 5;
    const widthOfScaleNumber = Math.max(widthOfMaxNumber, widthOfMinNumber);
    const maxStepsToPlace = Math.floor(this.scaleLength / widthOfScaleNumber);
    const maxStepsCounted = Math.round((max - min) / step);
    const howManyTimesBigger = Math.ceil(maxStepsCounted / maxStepsToPlace);

    this.newStep = maxStepsCounted > maxStepsToPlace && howManyTimesBigger > 1
      ? howManyTimesBigger * step
      : step;
  }

  private makeScaleRow(data: {
    min: number;
    max: number;
    toFixedDecimals: number;
  }): void {
    const { min, max, toFixedDecimals } = data;
    this.scaleItemRow = [];
    if (this.newStep > 0) {
      let i = min;
      while (i < max) {
        i = parseFloat(i.toFixed(toFixedDecimals));
        this.scaleItemRow.push(i);
        i += this.newStep;
      }
    } else {
      this.scaleItemRow.push(min, max);
    }
  }

  private countDistanceBetweenLastItems(min: number, max: number): void {
    const penultimateItem = this.scaleItemRow[this.scaleItemRow.length - 1];
    const lengthOfLeft = max - penultimateItem;
    const leftLengthInPx = fromValueToPX({
      value: lengthOfLeft,
      min,
      max,
      containerSize: this.scaleLength
    });
    const newContainerSize = this.scaleLength - leftLengthInPx - 1;
    this.tailContainer = Math.floor(this.scaleLength - newContainerSize);
  }

  private makeElementClasses(ifHorizontal: boolean): void {
    this.segmentClass = ifHorizontal
      ? 'scale__segment'
      : 'scale__segment scale__segment_vertical';
    this.spanClass = ifHorizontal
      ? 'scale__number'
      : 'scale__number scale__number_vertical';
  }

  private makeScaleItems(data: TScaleItemData): string {
    const {
      ifHorizontal, min, max, step
    } = data;
    const direction = ifHorizontal ? 'left' : 'bottom';
    return this.scaleItemRow
      .map((item) => this.createScaleItem({
        item, direction, min, max, step
      }))
      .join(' ');
  }

  private createScaleItem(data: TScaleItemSettings): string {
    const {
      item: value, direction, min, max, step
    } = data;
    const maxItem = this.scaleItemRow[this.scaleItemRow.length - 1];
    const notEnoughSpaceForMaxItem = this.tailContainer < 30;
    const itemIsMaxItem = value === maxItem;
    const distance = valueToPercentsApplyStep({
      value, min, max, step
    });

    const segmentStyle: string = itemIsMaxItem && notEnoughSpaceForMaxItem
      ? 'visibility: hidden;'
      : `${ direction }: ${ distance }%`;

    return `
      <div class = '${ this.segmentClass }' style = '${ segmentStyle }'>
        <span class = '${ this.spanClass }'>
          ${ value }
        </span>
      </div>`;
  }

  private makeMaxItem(ifHorizontal: boolean, max: number): string {
    const maxType: string = ifHorizontal ? 'right' : 'top';
    const maxStyle = `position: absolute; ${ maxType }: 0;`;
    const scaleItemMax = `
      <div class = '${ this.segmentClass }' style = '${ maxStyle }'>
        <span class = '${ this.spanClass }'>
          ${ max }
        </span>
      </div>`;
    return scaleItemMax;
  }
}

export default Scale;
