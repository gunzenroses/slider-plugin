import { SliderMaker } from "./components/mvp/sliderMaker.ts";
import "assets/slider.scss";

;($.fn.sliderPlugin = function(options) {
  SliderMaker(this.get(0), options);
});