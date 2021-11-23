import { TSettings } from "Utils/types";
import IPresenter from "Interfaces/IPresenter";
import IPanel from "Interfaces/IPanel";
import Presenter from "mvp/Presenter/Presenter";
import Panel from "Panel/Panel";
import { initialData } from "./initialData";

import "assets/slider.scss";

export default class SliderMaker {
  private presenter: IPresenter;
  private panel: IPanel | null;

  constructor(container: HTMLElement, options: TSettings, configurationPanel?: boolean) {
    const data = { ...initialData, ...options };
    this.presenter = new Presenter(container, data);
    this.panel = configurationPanel ? new Panel(container, this.presenter) : null;
    return this;
  }
}
