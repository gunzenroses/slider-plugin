import { fromValueToPX, getNumbersAfterDot, getTextWidth } from "utils/common";
import { TScaleOptions } from "utils/types";
import IView from "interfaces/IView";

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
    that.sliderContainer.append(this.element);
    return this.element;
  }

  private make(that: IView): HTMLElement {
    const scaleClass: string = that.settings.ifHorizontal
      ? "slider__scale"
      : "slider__scale_vertical";
    const totalClass = that.settings.scale ? [scaleClass] : [scaleClass, "js-disabled"];
    this.element = document.createElement("div");
    this.element.dataset.name = "scale";
    totalClass.forEach((item) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  private change(that: IView): HTMLElement {
    this.countContainerSize(that);
    this.makeScaleRow(that);
    this.makeScaleContainer(that);
    this.makeElementClasses(that);
    this.scaleItems.innerHTML = this.makeScaleItems(that) + this.makeMaxItem(that);
    return this.element;
  }

  private countContainerSize(that: IView): void {
    const parentNodeStyle = getComputedStyle(that.sliderContainer);
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
    const amountOfSteps = this.countAmountOfSteps(that, toFixedDecimals);
    const weightOfStep = that.settings.max / amountOfSteps;
    if (weightOfStep > 1) {
      let i = that.settings.min;
      while (i < that.settings.max) {
        i = parseFloat(i.toFixed(toFixedDecimals));
        this.scaleItemRow.push(i);
        i += weightOfStep;
      }
    } else {
      this.scaleItemRow.push(that.settings.min, that.settings.max);
    }
  }

  private countAmountOfSteps(that: IView, toFixedDecimals: number): number {
    let maxSteps;
    const widthOfScaleNumber =
      getTextWidth(
        (that.settings.max - that.settings.step).toFixed(toFixedDecimals),
        "16px TimesNewRoman"
      ) + 5;
    const maxStepsToPlace = Math.round(this.scaleLength / widthOfScaleNumber);
    const maxStepsCounted = Math.round((that.settings.max - that.settings.min) / that.settings.step);
    if (maxStepsCounted < maxStepsToPlace){
      maxSteps = maxStepsCounted;
    } else {
      const howManyTimesBigger = Math.ceil(maxStepsCounted / maxStepsToPlace);
      if (howManyTimesBigger === 1) {
        maxSteps = maxStepsToPlace;
      } else {
        const newStep = howManyTimesBigger * that.settings.step;
        maxSteps = Math.floor((that.settings.max - that.settings.min) / newStep);
      }
    }
    return maxSteps;
  }

  private makeScaleContainer(that: IView): void {
    const lengthOfLeft = that.settings.max - this.scaleItemRow[this.scaleItemRow.length - 1];
    const newContainerSize =
      this.scaleLength - fromValueToPX(lengthOfLeft, that.settings, this.scaleLength) - 1;
    this.tailContainer = Math.floor(this.scaleLength - newContainerSize);

    const scaleItemClass = that.settings.ifHorizontal ? "scale__row" : "scale__row_vertical";
    this.scaleItems = document.createElement("div");
    this.scaleItems.classList.add(scaleItemClass);
    that.settings.ifHorizontal
      ? (this.scaleItems.style.width = newContainerSize + "px")
      : (this.scaleItems.style.height = newContainerSize + "px");
  }

  private makeElementClasses(that: IView): void {
    this.segmentClass = that.settings.ifHorizontal ? "scale__segment" : "scale__segment_vertical";
    this.spanClass = that.settings.ifHorizontal ? "scale__number" : "scale__number_vertical";
  }

  private makeScaleItems(that: IView): string {
    this.itemWidth = Math.round(this.scaleLength / this.scaleItemRow.length);
    this.maxItem = this.scaleItemRow[this.scaleItemRow.length - 1];

    return this.scaleItemRow
      .map((item, index) => this.createScaleItem({ item, index, that }))
      .join(" ");
  }

  private createScaleItem(options: TScaleOptions): string {
    const { item, index, that } = options;
    const itemClass: string = that.settings.ifHorizontal ? "scale__point" : "scale__point_vertical";
    const special: string =
      item === this.maxItem && this.tailContainer < 30 ? `style= "visibility: hidden;"` : "";

    if (this.itemWidth > 40) {
      return `<div class=${this.segmentClass}><span class="${this.spanClass}" ${special}>${item}</span></div>`;
    } else {
      const numOfItems: number = Math.floor(50 / this.itemWidth);

      return item === that.settings.min ||
        ((item - that.settings.min) % that.settings.step === 0 && index % numOfItems === 0)
        ? `<div class=${this.segmentClass}><span class="${this.spanClass}" ${special}>${item}</span></div>`
        : `<div class=${itemClass}></div>`;
    }
  }

  private makeMaxItem(that: IView): string {
    const maxType: string = that.settings.ifHorizontal ? "right" : "top";
    const maxStyle = `position: absolute; ${maxType}: 0;`;
    const scaleItemMax = `<div class=${this.segmentClass} style="${maxStyle}""><span class="${this.spanClass}">${that.settings.max}</span></div>`;
    return scaleItemMax;
  }
}

export default Scale;
