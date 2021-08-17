export default function sliderContainerView(
  parentNode: HTMLElement,
  ifHorizontal: boolean
) {
  let sliderContainerClass = ifHorizontal
    ? "slider__content"
    : "slider__content_vertical";
  let sliderContainer = document.createElement("div");
  sliderContainer.classList.add(sliderContainerClass);
  parentNode.append(sliderContainer);
  return sliderContainer;
}
