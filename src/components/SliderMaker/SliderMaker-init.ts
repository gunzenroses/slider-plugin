import SliderMaker from './SliderMaker';
import $ from 'jquery';

$(document).ready(() => {
  $('.js-slider-init').each(
    (_: number, $slider: HTMLElement) => {
      if ($slider.children.length < 1) {
        new SliderMaker($slider);
      }
    }
  );
});

$.fn.sliderMaker = function makeSlider(
  options?: TSettings,
  ifPanel?: boolean
): SliderMaker | undefined {
  const element = this.get(0);
  if (element) {
    return new SliderMaker(element, ifPanel, options);
  }

  return undefined;
};
