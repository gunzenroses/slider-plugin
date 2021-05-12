import "../src/assets/styles/slider.scss"
import { SliderMaker } from "./assets/scripts/sliderMaker"

window.onload = function() {
    console.log("heeey");
    const $ = require('jquery')
    $("div").toggleClass("active");

    // здесь вызывать rangeSlider.ts for every slider
    //$.fn.SliderMaker()
    
    let simpleSlider = SliderMaker("RS", {
        max: 200,
    })
}