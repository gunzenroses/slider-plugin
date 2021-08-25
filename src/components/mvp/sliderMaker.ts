import { sliderData } from "./data";
import { IModel, SliderModel } from "./model";
import { IView, SliderView } from "./view";
import { IPresenter, SliderPresenter } from "./presenter";
import { IPanel, ConfigurationPanel } from "panel/panel";
import { TSettings } from "utils/types";

import "assets/slider.scss";

export default class SliderMaker {
  private model: IModel;
  private view: IView;
  private presenter: IPresenter;
  private panel: IPanel | null;

  constructor(container: HTMLElement, options: TSettings, configurationPanel?: boolean) {
    const data = { ...sliderData, ...options };
    this.model = new SliderModel(container, data);
    this.view = new SliderView(container);
    this.presenter = new SliderPresenter(this.model, this.view);
    this.panel = configurationPanel ? new ConfigurationPanel(container, this.presenter) : null;
    return this;
  }
}
