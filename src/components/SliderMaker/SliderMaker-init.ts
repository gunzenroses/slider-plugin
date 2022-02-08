import SliderMaker from './SliderMaker';

$.fn.sliderMaker = function makeSlider(
  options: TSettings,
  ifPanel: boolean
): JQuery {
  const element = this.get(0);
  if (element !== undefined) {
    new SliderMaker(element, options, ifPanel);
  }
  return this;
};
