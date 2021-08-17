import changeThumb from "./changeThumb";

export default function sliderThumbView(
  parentNode: HTMLElement,
  className: string,
  ifHorizontal: boolean,
  currentNum: number
) {
  let verticalClass = ifHorizontal ? "" : "-vertical";
  let thumbClass = `${className}${verticalClass}`;
  let sliderThumbView = document.createElement("div");
  sliderThumbView.classList.add("slider__thumb", thumbClass);

  changeThumb(sliderThumbView, ifHorizontal, currentNum);
  parentNode.append(sliderThumbView);
  return sliderThumbView;
}
