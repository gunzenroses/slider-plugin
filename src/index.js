import sliderPlugin from "./jquery.slider-plugin";
import "./index.css";

window.onload = function () {
  $("#horizontal").sliderPlugin({
      min: 10,
      max: 200,
      step: 120,
      scale: true,
      range: false
    }, true)

  $("#vertical").sliderPlugin({
    orientation: "vertical",
    step: 6,
    max: 140,
    scale: {
      stepPerDiv: 2
    },
    range: true,
    tooltip: false
  });
}