import changeThumb from "./changeThumb";

export default function sliderThumbView(
  parentNode: HTMLElement,
  className: string,
  ifHorizontal: boolean,
  currentNum: number
): HTMLElement {
  const verticalClass = ifHorizontal ? "" : "-vertical";
  const thumbClass = `${className}${verticalClass}`;
  const sliderThumbView = document.createElement("div");
  sliderThumbView.classList.add("slider__thumb", thumbClass);

  changeThumb(sliderThumbView, ifHorizontal, currentNum);
  parentNode.append(sliderThumbView);
  return sliderThumbView;
}
