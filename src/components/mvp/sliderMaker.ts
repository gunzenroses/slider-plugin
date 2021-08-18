import "assets/slider.scss";
import { sliderData } from "./data";
import { TSettings } from "utils/types";
import { SliderModel } from "./model";
import { SliderView } from "./view";
import { SliderPresenter } from "./presenter";
import ConfigurationPanel from "panel/panel";

export default function sliderMaker(
  container: HTMLElement,
  options: TSettings,
  configurationPanel?: boolean
) {
  let aModel = new SliderModel(container, {...sliderData, ...options});
  let aView = new SliderView(container);
  let aPresenter = new SliderPresenter(aModel, aView);
  let cp = configurationPanel ? new ConfigurationPanel(container, aPresenter) : null;
  return { aPresenter }
}


//TODO: если ошибка выдать!