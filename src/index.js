import sliderMaker from "./slider-plugin";
import "./index.css";

window.onload = function () {
  $("#horizontal").sliderMaker(
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

  $("#vertical").sliderMaker({
    orientation: "vertical",
    step: 6,
    max: 140,
    scale: {
      stepPerDiv: 2,
    },
    range: true,
    tooltip: false,
  }, 
    true
  );

  $("#default").sliderMaker({
    range: false,
  }, true);
}