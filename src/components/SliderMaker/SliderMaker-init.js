import SliderMaker from './SliderMaker.ts';

(function ($) {
  $.fn.sliderMaker = function (options, panel) {
    return new SliderMaker(this.get(0), options, panel);
  };
}(jQuery));
