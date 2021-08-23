import { commonDivider } from "utils/common";

export default function scaleItem(
  item: number,
  index: number,
  sequenceNum: number,
  itemWidth: number,
  ifHorizontal: boolean,
  segmentClass: string,
  spanClass: string,
  min: number,
  max: number,
  step: number,
  tailContainer: number
) {
  const itemClass: string = ifHorizontal ? "scale__point" : "scale__point_vertical";

  const special: string = item === max && tailContainer < 25 ? `style= "visibility: hidden;"` : "";

  if (itemWidth > 40) {
    return `<div class=${segmentClass}><span class="${spanClass}" ${special}>${item}</span></div>`;
  } else {
    const temp: number = Math.round(40 / itemWidth);
    const numOfItems: number =
      sequenceNum <= temp
        ? temp
        : sequenceNum % temp === 0
        ? temp
        : commonDivider(sequenceNum, temp);

    return item === min ||
      ((item - min) % (sequenceNum * step) === 0 &&
        index % numOfItems === 0 &&
        index % sequenceNum === 0)
      ? `<div class=${segmentClass}><span class="${spanClass}" ${special}>${item}</span></div>`
      : `<div class=${itemClass}></div>`;
  }
}
