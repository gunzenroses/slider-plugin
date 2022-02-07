import IPresenter from './IPresenter';

interface IPanel {
  presenter: IPresenter;
  panelContainer: HTMLElement;
  data: TSettings;

  init(): void;
  render(data: TSettings): void;
  changePanel(e: Event): void;
  updatePanel(): void;
}

export default IPanel;
