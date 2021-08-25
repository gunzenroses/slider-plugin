export default function changeThumb(
  object: HTMLElement,
  ifHorizontal: boolean,
  newThumbCurrent: number
): HTMLElement {
  ifHorizontal
    ? (object.style.left = newThumbCurrent + "%")
    : (object.style.bottom = newThumbCurrent + "%");
  return object;
}
