import { IView } from "mvp/view";
import ISubview from "subview/subviewElement";
export default class SliderRange implements ISubview {
    element: HTMLElement;
    constructor(that: IView);
    init(that: IView): HTMLElement;
    make(that: IView): HTMLElement;
    change(that: IView): HTMLElement;
    private changeFirst;
    private changeSecond;
}
