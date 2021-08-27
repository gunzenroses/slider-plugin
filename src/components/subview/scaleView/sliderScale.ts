import { IView } from "mvp/view";
import { commonDivider, fromValueToPX } from "utils/common";

type TScaleItem = {
  width: number;
  stepPerDiv: number;
  segmentClass: string;
  spanClass: string;
};

type TOptionsItem = {
  item: number;
  index: number;
  that: IView;
};

export default class SliderScale {
  scale!: HTMLElement;
  scaleItemRow!: number[];
  containerSize!: number;
  tailContainer!: number;
  scaleContainer!: HTMLDivElement;
  item!: TScaleItem;
  scaleLength!: number;
  scaleItems!: HTMLDivElement;
  segmentClass!: string;
  spanClass!: string;
  stepPerDivValue!: number;
  itemWidth!: number;
  maxItem!: number;

  constructor(that: IView) {
    this.init(that);
  }

  init(that: IView): HTMLElement {
    this.make(that);
    this.changeScale(that);
    this.scale.append(this.scaleItems);
    that.sliderContainer.append(this.scale);
    return this.scale;
  }

  make(that: IView): void {
    const scaleClass: string = that.ifHorizontal ? "slider__scale" : "slider__scale_vertical";
    const totalClass = that.ifScale ? `${scaleClass}` : `${scaleClass} disable`;
    this.scale = document.createElement("div");
    this.scale.dataset.name = "scale";
    this.scale.classList.add(totalClass);
  }

  changeScale(that: IView): void {
    this.countContainerSize(that);
    this.makeScaleRow(that);
    this.makeScaleContainer(that);
    this.makeElementClasses(that);
    this.scaleItems.innerHTML = this.makeScaleItems(that) + this.makeMaxItem(that);
  }

  private countContainerSize(that: IView): void {
    const parentNodeStyle = getComputedStyle(that.sliderContainer);
    this.scaleLength = that.ifHorizontal
      ? Math.ceil(parseFloat(parentNodeStyle.width))
      : Math.ceil(parseFloat(parentNodeStyle.height));
  }

  private makeScaleRow(that: IView): void {
    this.scaleItemRow = [];
    let i = that.minValue;
    while (i < that.maxValue) {
      this.scaleItemRow.push(i);
      i += that.stepValue;
    }
  }

  private makeScaleContainer(that: IView) {
    const lengthOfLeft = that.maxValue - this.scaleItemRow[this.scaleItemRow.length - 1];
    const newContainerSize =
      this.scaleLength -
      fromValueToPX(lengthOfLeft, that.maxValue, that.minValue, this.scaleLength) -
      1;
    this.tailContainer = Math.floor(this.scaleLength - newContainerSize);

    const scaleItemClass = that.ifHorizontal ? "scale__row" : "scale__row_vertical";
    this.scaleItems = document.createElement("div");
    this.scaleItems.classList.add(scaleItemClass);
    that.ifHorizontal
      ? (this.scaleItems.style.width = newContainerSize + "px")
      : (this.scaleItems.style.height = newContainerSize + "px");
  }

  makeElementClasses(that: IView): void {
    this.segmentClass = that.ifHorizontal ? "scale__segment" : "scale__segment_vertical";
    this.spanClass = that.ifHorizontal ? "scale__number" : "scale__number_vertical";
  }

  makeScaleItems(that: IView): string {
    this.itemWidth = Math.round(this.scaleLength / this.scaleItemRow.length);
    this.stepPerDivValue = that.stepPerDiv ? that.stepPerDiv : 1;
    this.maxItem = this.scaleItemRow[this.scaleItemRow.length - 1];

    return this.scaleItemRow
      .map((item, index) => this.createScaleItem({ item, index, that }))
      .join(" ");
  }

  createScaleItem(options: TOptionsItem): string {
    const { item, index, that } = options;
    const itemClass: string = that.ifHorizontal ? "scale__point" : "scale__point_vertical";
    const special: string =
      item === this.maxItem && this.tailContainer < 30 ? `style= "visibility: hidden;"` : "";

    if (this.itemWidth > 40) {
      return `<div class=${this.segmentClass}><span class="${this.spanClass}" ${special}>${item}</span></div>`;
    } else {
      const temp: number = Math.floor(50 / this.itemWidth);
      let numOfItems;
      if (this.stepPerDivValue <= temp || this.stepPerDivValue % temp === 0) {
        numOfItems = temp;
      } else {
        numOfItems = commonDivider(this.stepPerDivValue, temp);
      }

      return item === that.minValue ||
        ((item - that.minValue) % (this.stepPerDivValue * that.stepValue) === 0 &&
          index % numOfItems === 0 &&
          index % this.stepPerDivValue === 0)
        ? `<div class=${this.segmentClass}><span class="${this.spanClass}" ${special}>${item}</span></div>`
        : `<div class=${itemClass}></div>`;
    }
  }

  makeMaxItem(that: IView): string {
    const maxType: string = that.ifHorizontal ? "right" : "top";
    const maxStyle = `position: absolute; ${maxType}: 0;`;
    const scaleItemMax = `<div class=${this.segmentClass} style="${maxStyle}""><span class="${this.spanClass}">${that.maxValue}</span></div>`;
    return scaleItemMax;
  }
}
