import { TSettings } from 'utils/types';
import initialData from 'scripts/initialData';
import IPresenter from 'Interfaces/IPresenter';
import IPanel from 'Interfaces/IPanel';
import Presenter from 'Presenter/Presenter';
import Panel from 'Panel/Panel';

import 'assets/styles/slider.scss';

class SliderMaker {
  private presenter: IPresenter;

  private panel: IPanel | null;

  constructor(
    container: HTMLElement,
    options: TSettings,
    configurationPanel?: boolean
  ) {
    const data = { ...initialData, ...options };
    this.presenter = new Presenter(container, data);
    this.panel = configurationPanel
      ? new Panel(container, this.presenter)
      : null;
  }
}

export default SliderMaker;
