import { sliderData } from "./data";
import { IPresenter, Presenter } from "./presenter";
import { IPanel, ConfigurationPanel } from "panel/panel";
import { TSettings } from "utils/types";

import "assets/slider.scss";

export default class SliderMaker {
  private presenter: IPresenter;
  private panel: IPanel | null;

  constructor(container: HTMLElement, options: TSettings, configurationPanel?: boolean) {
    const data = { ...sliderData, ...options };
    this.presenter = new Presenter(container, data);
    this.panel = configurationPanel ? new ConfigurationPanel(container, this.presenter) : null;
    return this;
  }
}
