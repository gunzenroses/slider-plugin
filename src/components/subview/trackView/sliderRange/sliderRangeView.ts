import changeRange from "./changeRange";

//here all values are in %
export default function sliderRangeView(
  parentNode: HTMLElement,
  ifRange: boolean,
  ifHorizontal: boolean,
  currentFirst: number,
  currentSecond: number
) {
  let sliderRangeClass: string = ifHorizontal
    ? "slider__range"
    : "slider__range_vertical";
  let sliderRange = document.createElement("div");
  sliderRange.classList.add(`${sliderRangeClass}`);

  switch (ifRange) {
    case true:
      changeRange(sliderRange, currentFirst, ifHorizontal, ifRange, true);
      changeRange(sliderRange, currentSecond, ifHorizontal, ifRange, false);
      break;
    case false:
      changeRange(sliderRange, currentFirst, ifHorizontal, ifRange, true);
      break;
    default:
      break;
  }

  parentNode.append(sliderRange);
  return sliderRange;
}
