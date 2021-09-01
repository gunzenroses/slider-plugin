import { IView } from "mvp/view";
declare type TScaleItem = {
    width: number;
    stepPerDiv: number;
    segmentClass: string;
    spanClass: string;
};
declare type TOptionsItem = {
    item: number;
    index: number;
    that: IView;
};
export default class SliderScale {
    scale: HTMLElement;
    scaleItemRow: number[];
    containerSize: number;
    tailContainer: number;
    scaleContainer: HTMLDivElement;
    item: TScaleItem;
    scaleLength: number;
    scaleItems: HTMLDivElement;
    segmentClass: string;
    spanClass: string;
    stepPerDivValue: number;
    itemWidth: number;
    maxItem: number;
    constructor(that: IView);
    init(that: IView): HTMLElement;
    make(that: IView): void;
    changeScale(that: IView): void;
    private countContainerSize;
    private makeScaleRow;
    private makeScaleContainer;
    makeElementClasses(that: IView): void;
    makeScaleItems(that: IView): string;
    createScaleItem(options: TOptionsItem): string;
    makeMaxItem(that: IView): string;
}
export {};
