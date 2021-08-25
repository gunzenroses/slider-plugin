export default function sliderTrackView(
  parentNode: HTMLElement,
  ifHorizontal: boolean
): HTMLElement {
  const sliderTrackClass: string = ifHorizontal ? "slider__track" : "slider__track_vertical";
  const sliderTrack = document.createElement("div");
  sliderTrack.classList.add(sliderTrackClass);
  parentNode.append(sliderTrack);
  return sliderTrack;
}
