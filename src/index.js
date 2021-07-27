import SliderMaker from "./components/mvp/sliderMaker.ts";
import "./index.css";

window.onload = function() {    
    let simpleSlider = SliderMaker("horizontal", {
        min: 10,
        max: 140,
        step: 20,
        scale: true,
        range: false
    }, true)

    let verticalSlider = SliderMaker("vertical", {
        orientation: "vertical",
        step: 6,
        max: 140,
        scale: {
            stepPerDiv: 2
        },
        range: true,
        tooltip: false
    }, true)
}