import "../styles/slider.scss"
import { sliderData } from "./data"
import { TSettings } from "./types/types"
import { SliderModel } from "./model"
import { SliderView } from "./view"
import { SliderPresenter } from "./presenter"
import { ConfigurationPanel } from "./panel/panel"

function SliderMaker(id: string, options: TSettings, configurationPanel?: boolean){

    let settings = function (sliderData: TSettings, options: TSettings){
        var c: TSettings = {};
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

    let aConfigurationPanel = 
        configurationPanel
            ? new ConfigurationPanel(id, aPresenter)
            : null;
}

export { SliderMaker }