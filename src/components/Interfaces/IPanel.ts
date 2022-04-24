import IPresenter from './IPresenter';

interface IPanel {
  container: HTMLElement;
  presenter: IPresenter;
  data: TSettings;

  init(): void;
  render(data: TSettings): void;
  changePanel(e: Event): void;
  updatePanel(data: TSettings): void;
}

export default IPanel;
