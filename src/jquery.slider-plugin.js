import SliderMaker from "./components/mvp/sliderMaker.ts";
import "assets/slider.scss";

;($.fn.sliderPlugin = function(options, panel) {
  return new SliderMaker(this.get(0), options, panel);
});