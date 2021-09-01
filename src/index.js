import sliderPlugin from "./jquery.slider-plugin";
import "./index.css";

window.onload = function () {
  $("#horizontal").sliderPlugin(
    {
      min: 10,
      max: 200,
      currentSecond: 150,
      step: 12,
      scale: true,
      range: true,
    },
    true
  );

  $("#vertical").sliderPlugin({
    orientation: "vertical",
    step: 6,
    max: 140,
    scale: {
      stepPerDiv: 2,
    },
    range: true,
    tooltip: false,
  });

  $("#default").sliderPlugin({
    range: false,
  }, true);
}