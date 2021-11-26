import { commonDivider, fromValueToPX } from "Utils/common";
import { TScaleItem, TScaleOptions } from "Utils/types";
import { IView } from "mvp/View/View";
import ISubview from "Interfaces/ISubview";

export default class Scale implements ISubview {
  element!: HTMLElement;
  scaleItemRow!: number[];
  tailContainer!: number;
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
    this.change(that);
    this.element.append(this.scaleItems);
    that.sliderContainer.append(this.element);
    return this.element;
  }

  make(that: IView): HTMLElement {
    const scaleClass: string = that.settings.ifHorizontal
      ? "slider__scale"
      : "slider__scale_vertical";
    const totalClass = that.settings.scale ? [scaleClass] : [scaleClass, "disabled"];
    this.element = document.createElement("div");
    this.element.dataset.name = "scale";
    totalClass.forEach((item) => {
      this.element.classList.add(item);
    });
    return this.element;
  }

  change(that: IView): HTMLElement {
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
    let i = that.settings.min;
    while (i < that.settings.max) {
      this.scaleItemRow.push(i);
      i += that.settings.step;
    }
  }

  private makeScaleContainer(that: IView) {
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
    this.stepPerDivValue = (typeof that.settings.scale === "boolean") 
      ? 1
      : that.settings.scale.stepPerDiv;
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

  private makeMaxItem(that: IView): string {
    const maxType: string = that.settings.ifHorizontal ? "right" : "top";
    const maxStyle = `position: absolute; ${maxType}: 0;`;
    const scaleItemMax = `<div class=${this.segmentClass} style="${maxStyle}""><span class="${this.spanClass}">${that.settings.max}</span></div>`;
    return scaleItemMax;
  }
}
