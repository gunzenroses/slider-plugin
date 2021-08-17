export default function sliderTrackView(
  parentNode: HTMLElement,
  ifHorizontal: boolean
) {
  let sliderTrackClass: string = ifHorizontal
    ? "slider__track"
    : "slider__track_vertical";
  let sliderTrack = document.createElement("div");
  sliderTrack.classList.add(sliderTrackClass);
  parentNode.append(sliderTrack);
  return sliderTrack;
}
