import { IModel } from "./model";
import { IView } from "./view";
import { EventDispatcher } from "./eventDispatcher";
import { IModelData, TSettings } from "utils/types";
interface IPresenter {
    model: IModel;
    view: IView;
    container: HTMLElement;
    data: TSettings;
    changingObject: HTMLElement | null;
    init(): void;
    modelData(name: string, data: IModelData): void;
    fromPresenterUpdate: EventDispatcher;
    fromPresenterThumbUpdate: EventDispatcher;
    fromPresenterThumbSecondUpdate: EventDispatcher;
}
declare class SliderPresenter implements IPresenter {
    model: IModel;
    view: IView;
    container: HTMLElement;
    data: TSettings;
    changingObject: HTMLElement | null;
    containerSize: number;
    thumbWidth: number;
    fromPresenterUpdate: EventDispatcher;
    fromPresenterThumbUpdate: EventDispatcher;
    fromPresenterThumbSecondUpdate: EventDispatcher;
    private min;
    private max;
    private step;
    private ifHorizontal;
    private ifRange;
    fromModelChangeViewHandler: {
        (newThumbValue: number): void;
    };
    fromModelUpdateDataHandler: {
        (data: TSettings): void;
    };
    fromViewSelectThumbHandler: {
        (e: PointerEvent): void;
    };
    fromViewDragThumbHandler: {
        (e: PointerEvent): void;
    };
    constructor(model: IModel, view: IView);
    init(): void;
    updateView(): void;
    private createChildren;
    private setupHandlers;
    private enable;
    private setObject;
    private selectThumb;
    private countPosition;
    private selectThumbRangeFalse;
    private selectThumbRangeTrue;
    private countPercents;
    private findClosestThumb;
    dragThumb(e: PointerEvent): void;
    private dragThumbRangeFalse;
    private dragThumbRangeTrue;
    modelData(name: string, data: IModelData): void;
    private modelThumbFirst;
    private modelThumbSecond;
    private updateData;
    private updateThumbs;
}
export { IPresenter, SliderPresenter };
