export default function sliderContainerView(parentNode: HTMLElement, ifHorizontal: boolean) {
  const sliderContainerClass = ifHorizontal ? "slider__content" : "slider__content_vertical";
  const sliderContainer = document.createElement("div");
  sliderContainer.classList.add(sliderContainerClass);
  parentNode.append(sliderContainer);
  return sliderContainer;
}
