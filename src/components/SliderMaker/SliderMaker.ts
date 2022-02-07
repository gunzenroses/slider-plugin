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
    ifPanel?: boolean
  ) {
    const data = { ...initialData, ...options };
    this.presenter = new Presenter(container, data);
    this.panel = ifPanel
      ? new Panel(container, this.presenter)
      : null;
  }
}

export default SliderMaker;
