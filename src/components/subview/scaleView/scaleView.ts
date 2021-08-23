import scaleItemRow from "./scaleItemRow";

export default function scaleView(
  parentNode: HTMLElement,
  ifHorizontal: boolean,
  max: number,
  min: number,
  step: number,
  stepPerDiv?: number
): HTMLElement {
  const scaleClass: string = ifHorizontal ? "slider__scale" : "slider__scale_vertical";

  const scale: HTMLElement = document.createElement("div");
  scale.dataset.name = "scale";
  scale.classList.add(scaleClass);

  const parentNodeStyle = getComputedStyle(parentNode);
  const scaleLength = ifHorizontal
    ? Math.ceil(parseFloat(parentNodeStyle.width))
    : Math.ceil(parseFloat(parentNodeStyle.height));

  scale.append(scaleItemRow(ifHorizontal, scaleLength, min, max, step, stepPerDiv));
  parentNode.append(scale);
  return scale;
}
