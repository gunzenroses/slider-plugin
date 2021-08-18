import sliderMaker from "./components/mvp/sliderMaker.ts";
import "assets/slider.scss";

;($.fn.sliderPlugin = function(options) {
  sliderMaker(this.get(0), options);
});