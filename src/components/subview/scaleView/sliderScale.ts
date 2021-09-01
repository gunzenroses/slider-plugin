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
    const scaleClass: string = that.settings.ifHorizontal
      ? "slider__scale"
      : "slider__scale_vertical";
    const totalClass = that.settings.scale ? [scaleClass] : [scaleClass, "disabled"];
    this.scale = document.createElement("div");
    this.scale.dataset.name = "scale";
    totalClass.forEach((item) => {
      this.scale.classList.add(item);
    });
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
    this.scaleLength = that.settings.ifHorizontal
      ? Math.ceil(parseFloat(parentNodeStyle.width))
      : Math.ceil(parseFloat(parentNodeStyle.height));
  }

  private makeScaleRow(that: IView): void {
    this.scaleItemRow = [];
    let i = that.settings.min;
    while (i < that.settings.max) {
      this.scaleItemRow.push(i);
      i += that.settings.step;
    }
  }

  private makeScaleContainer(that: IView) {
    const lengthOfLeft = that.settings.max - this.scaleItemRow[this.scaleItemRow.length - 1];
    const newContainerSize =
      this.scaleLength -
      fromValueToPX(lengthOfLeft, that.settings.max, that.settings.min, this.scaleLength) -
      1;
    this.tailContainer = Math.floor(this.scaleLength - newContainerSize);

    const scaleItemClass = that.settings.ifHorizontal ? "scale__row" : "scale__row_vertical";
    this.scaleItems = document.createElement("div");
    this.scaleItems.classList.add(scaleItemClass);
    that.settings.ifHorizontal
      ? (this.scaleItems.style.width = newContainerSize + "px")
      : (this.scaleItems.style.height = newContainerSize + "px");
  }

  makeElementClasses(that: IView): void {
    this.segmentClass = that.settings.ifHorizontal ? "scale__segment" : "scale__segment_vertical";
    this.spanClass = that.settings.ifHorizontal ? "scale__number" : "scale__number_vertical";
  }

  makeScaleItems(that: IView): string {
    this.itemWidth = Math.round(this.scaleLength / this.scaleItemRow.length);
    this.stepPerDivValue = that.settings.stepPerDiv ? that.settings.stepPerDiv : 1;
    this.maxItem = this.scaleItemRow[this.scaleItemRow.length - 1];

    return this.scaleItemRow
      .map((item, index) => this.createScaleItem({ item, index, that }))
      .join(" ");
  }

  createScaleItem(options: TOptionsItem): string {
    const { item, index, that } = options;
    const itemClass: string = that.settings.ifHorizontal ? "scale__point" : "scale__point_vertical";
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

      return item === that.settings.min ||
        ((item - that.settings.min) % (this.stepPerDivValue * that.settings.step) === 0 &&
          index % numOfItems === 0 &&
          index % this.stepPerDivValue === 0)
        ? `<div class=${this.segmentClass}><span class="${this.spanClass}" ${special}>${item}</span></div>`
        : `<div class=${itemClass}></div>`;
    }
  }

  makeMaxItem(that: IView): string {
    const maxType: string = that.settings.ifHorizontal ? "right" : "top";
    const maxStyle = `position: absolute; ${maxType}: 0;`;
    const scaleItemMax = `<div class=${this.segmentClass} style="${maxStyle}""><span class="${this.spanClass}">${that.settings.max}</span></div>`;
    return scaleItemMax;
  }
}
