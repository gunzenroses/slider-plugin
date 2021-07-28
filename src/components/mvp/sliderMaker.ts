import "styles/slider.scss"
import { sliderData } from "./data"
import { TSettings } from "utils/types"
import { SliderModel } from "./model"
import { SliderView } from "./view"
import { SliderPresenter } from "./presenter"
import ConfigurationPanel from "panel/panel"
import { mergeData } from "utils/common"

export default function SliderMaker(id: string, options: TSettings, configurationPanel?: boolean){

    let aModel = new SliderModel(id, mergeData(sliderData, options));
    let aView = new SliderView(id);
    let aPresenter = new SliderPresenter(aModel, aView);

    let aConfigurationPanel = 
        configurationPanel
            ? new ConfigurationPanel(id, aPresenter)
            : null;
}