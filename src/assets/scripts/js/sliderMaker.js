import { sliderData } from "../data"
import { SliderModel } from "../model"
import { SliderView } from "../view"
import { SliderPresenter } from "../presenter"

function SliderMaker(id, options){

    let settings = function (sliderData, options){
        var c = {};
        for (let key in sliderData){
            if (sliderData.hasOwnProperty(key)){
                c[key] = key in options ? options[key] : sliderData[key]
            }
        };
        return c;
    }

    let aModel = new SliderModel(id, settings(sliderData,options));
    let aView = new SliderView();
    let aPresenter = new SliderPresenter(aModel, aView);
}

// (function($){
//     $.fn.rangeSlider = function (options) {
//         var settings = $.extend({
//             'orientation': 'horizontal',
//             'background-color': 'none',
//             'double-range': 'true'
//         }, options);
//         return  this.each(function(){
//             //сборка плагина
//         })
//     }
// })(jQuery)

export { SliderMaker }