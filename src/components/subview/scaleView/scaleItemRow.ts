import scaleItem from "./scaleItem";
import { fromValueToPX } from "utils/common";

export default function scaleItemRow(
  ifHorizontal: boolean,
  containerSize: number,
  min: number,
  max: number,
  step: number,
  stepPerDiv?: number
): HTMLElement {
  //find the row of elements (with step)
  const scaleItemRow: number[] = [];
  let i = min;
  while (i < max) {
    scaleItemRow.push(i);
    i += step;
  }

  const itemWidth = Math.round(containerSize / scaleItemRow.length);
  const stepPerDivValue = stepPerDiv ? stepPerDiv : 1;

  //determine classes for elements
  const segmentClass: string = ifHorizontal ? "scale__segment" : "scale__segment_vertical";
  const spanClass: string = ifHorizontal ? "scale__number" : "scale__number_vertical";
  const scaleItemClass = ifHorizontal ? "scale__row" : "scale__row_vertical";

  //to find the length of row of divisions (exc the max value)
  const lengthOfLeft = max - scaleItemRow[scaleItemRow.length - 1];
  const newContainerSize = containerSize - fromValueToPX(lengthOfLeft, max, min, containerSize) - 1;
  const tailContainer = Math.floor(containerSize - newContainerSize);

  //creation of row of items
  const scaleItems: HTMLElement = document.createElement("div");
  scaleItems.classList.add(scaleItemClass);
  ifHorizontal
    ? (scaleItems.style.width = newContainerSize + "px")
    : (scaleItems.style.height = newContainerSize + "px");

  //special style for item with max value
  const marginType: string = ifHorizontal ? "right" : "top";
  const maxStyle = `position: absolute; ${marginType}: 0;`;
  const scaleItemMax = `<div class=${segmentClass} style="${maxStyle}""><span class="${spanClass}">${max}</span></div>`;

  scaleItems.innerHTML =
    scaleItemRow
      .map((item, index) =>
        scaleItem(
          item,
          index,
          stepPerDivValue,
          itemWidth,
          ifHorizontal,
          segmentClass,
          spanClass,
          min,
          scaleItemRow[scaleItemRow.length - 1],
          step,
          tailContainer
        )
      )
      .join(" ") + scaleItemMax;

  return scaleItems;
}
