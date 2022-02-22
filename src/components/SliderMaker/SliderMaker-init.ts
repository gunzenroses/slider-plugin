import SliderMaker from './SliderMaker';

$.fn.sliderMaker = function makeSlider(
  options?: TSettings,
  ifPanel?: boolean
): SliderMaker | undefined {
  const element = this.get(0);
  if (element) {
    return new SliderMaker(ifPanel, element, options);
  }
  else {
    document.querySelectorAll('.js-slider-init').forEach((slider) => {
      return new SliderMaker(ifPanel, slider as HTMLElement, options);
    })
  }
  return undefined;
};