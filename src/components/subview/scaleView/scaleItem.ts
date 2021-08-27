import { commonDivider } from "utils/common";

export default function scaleItem(
  item: number,
  index: number,
  stepPerDivValue: number,
  itemWidth: number,
  ifHorizontal: boolean,
  segmentClass: string,
  spanClass: string,
  min: number,
  max: number,
  step: number,
  tailContainer: number
): string {
  const itemClass: string = ifHorizontal ? "scale__point" : "scale__point_vertical";

  const special: string = item === max && tailContainer < 25 ? `style= "visibility: hidden;"` : "";

  let numOfItems;
  if (itemWidth > 40) {
    return `<div class=${segmentClass}><span class="${spanClass}" ${special}>${item}</span></div>`;
  } else {
    const temp: number = Math.floor(50 / itemWidth);
    numOfItems =
      stepPerDivValue <= temp || stepPerDivValue % temp === 0
        ? temp
        : commonDivider(stepPerDivValue, temp);
  }

  return item === min ||
    ((item - min) % (stepPerDivValue * step) === 0 &&
      index % numOfItems === 0 &&
      index % stepPerDivValue === 0)
    ? `<div class=${segmentClass}><span class="${spanClass}" ${special}>${item}</span></div>`
    : `<div class=${itemClass}></div>`;
}
