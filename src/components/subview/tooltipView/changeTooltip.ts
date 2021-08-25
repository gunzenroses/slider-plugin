import { fromPercentsToValue } from "utils/common";

export default function changeTooltip(
  object: HTMLElement,
  newThumbCurrent: number,
  max: number,
  min: number
): HTMLElement {
  object.innerText = fromPercentsToValue(newThumbCurrent, max, min);
  return object;
}
