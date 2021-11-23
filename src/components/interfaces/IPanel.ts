import { TSettings } from "Utils/types";
import IPresenter from "./IPresenter";

export default interface IPanel {
  presenter: IPresenter;
  panelContainer: HTMLElement;
  data: TSettings;

  init(): void;
  render(data: TSettings): void;
  changePanel(e: Event): void;
  updatePanel(): void;
}
