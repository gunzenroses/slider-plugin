import { SliderMaker } from "./assets/scripts/sliderMaker"
import "./index.css"

window.onload = function() {
    const $ = require('jquery')
    $("div").toggleClass("active");

    // здесь вызывать rangeSlider.ts for every slider
    //$.fn.SliderMaker()
    
    let simpleSlider = SliderMaker("horizontal", {
        max: 120,
        step: 7,
        scale: true,
        range: true,
    })

    let verticalSlider = SliderMaker("vertical", {
        orientation: "vertical",
        step: 6,
        max: 120,
        scale: true,
        range: false,
    })
}