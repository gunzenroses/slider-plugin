import "../styles/slider.scss"
import { sliderData } from "./mvp/data"
import { TSettings } from "./types/types"
import { SliderModel } from "./mvp/model"
import { SliderView } from "./mvp/view"
import { SliderPresenter } from "./mvp/presenter"
import { ConfigurationPanel } from "./panel/panel"
import { mergeData } from "./helpers/common"

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