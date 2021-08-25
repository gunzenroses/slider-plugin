export default function changeRange(
  object: HTMLElement,
  newThumbCurrent: number,
  ifHorizontal: boolean,
  ifRange: boolean,
  ifThumbFirst: boolean
): HTMLElement {
  ifRange
    ? ifHorizontal
      ? ifThumbFirst
        ? (object.style.left = newThumbCurrent + "%")
        : (object.style.right = 100 - newThumbCurrent + "%")
      : ifThumbFirst
      ? (object.style.bottom = newThumbCurrent + "%")
      : (object.style.top = 100 - newThumbCurrent + "%")
    : ifHorizontal
    ? (object.style.right = 100 - newThumbCurrent + "%")
    : (object.style.top = 100 - newThumbCurrent + "%");
  return object;
}
