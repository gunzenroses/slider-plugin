import SliderMaker from './components/sliderMaker.ts';

(function($){
  $.fn.sliderMaker = function (options, panel) {
  return new SliderMaker(this.get(0), options, panel);
  };
})(jQuery);
