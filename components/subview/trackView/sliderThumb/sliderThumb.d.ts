import { IView } from "mvp/view";
import ISubview from "subview/subviewElement";
export default class SliderThumb implements ISubview {
    element: HTMLElement;
    className: string;
    constructor(that: IView, className: string);
    init(that: IView): HTMLElement;
    make(that: IView): HTMLElement;
    change(that: IView): HTMLElement;
}
