import { IView } from "mvp/View/View";

export default interface ISubview {
  element: HTMLElement;
  make(that: IView): HTMLElement;
  change(that: IView): HTMLElement;
}
