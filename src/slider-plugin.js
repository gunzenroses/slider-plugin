import SliderMaker from "./components/sliderMaker.ts";
import "assets/slider.scss";

(function($){
  $.fn.sliderMaker = function (options, panel) {
  return new SliderMaker(this.get(0), options, panel);
  };
})(jQuery);
