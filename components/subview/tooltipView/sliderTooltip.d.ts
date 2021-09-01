import { IView } from "mvp/view";
import ISubview from "subview/subviewElement";
export default class SliderTooltip implements ISubview {
    className: string;
    element: HTMLElement;
    parentNode: HTMLElement;
    constructor(that: IView, className: string);
    init(that: IView): HTMLElement;
    createChildren(that: IView): void;
    make(that: IView): HTMLElement;
    change(that: IView): HTMLElement;
    append(): void;
}
