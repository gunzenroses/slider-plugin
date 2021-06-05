import "../styles/slider.scss"
import { sliderData } from "./data"
import { Settings } from "./types/types"
import { SliderModel } from "./model"
import { SliderView } from "./view"
import { SliderPresenter } from "./presenter"

function SliderMaker(id: string, options: Settings){

    let settings = function (sliderData: Settings, options: Settings){
        var c: Settings = {};
        let key: string;
        for (key in sliderData){
            if (sliderData.hasOwnProperty(key)){
                c[key] = key in options ? options[key] : sliderData[key]
            }
        };
        return c;
    }

    let aModel = new SliderModel(id, settings(sliderData,options));
    let aView = new SliderView(id);
    let aPresenter = new SliderPresenter(aModel, aView);
}

export { SliderMaker }