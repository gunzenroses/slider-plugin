import { IView } from "mvp/view";
export default interface ISubview {
    element: HTMLElement;
    make(that: IView): HTMLElement;
    change(that: IView): HTMLElement;
}
