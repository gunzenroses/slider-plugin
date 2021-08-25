export default function sliderContainerView(
  parentNode: HTMLElement,
  ifHorizontal: boolean
): HTMLElement {
  const sliderContainerClass = ifHorizontal ? "slider__content" : "slider__content_vertical";
  const sliderContainer = document.createElement("div");
  sliderContainer.classList.add(sliderContainerClass);
  parentNode.append(sliderContainer);
  return sliderContainer;
}
