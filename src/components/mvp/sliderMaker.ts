import "../styles/slider.scss"
import { sliderData } from "./data"
import { TSettings } from "../../scripts/types/types"
import { SliderModel } from "./model"
import { SliderView } from "./view"
import { SliderPresenter } from "./presenter"
import { ConfigurationPanel } from "../panel/panel"
import { mergeData } from "../../scripts/helpers/common"

function SliderMaker(id: string, options: TSettings, configurationPanel?: boolean){

    let aModel = new SliderModel(id, mergeData(sliderData, options));
    let aView = new SliderView(id);
    let aPresenter = new SliderPresenter(aModel, aView);

    let aConfigurationPanel = 
        configurationPanel
            ? new ConfigurationPanel(id, aPresenter)
            : null;
}

export { SliderMaker }