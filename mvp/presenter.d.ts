import { IModel } from "./model";
import { IView } from "./view";
import { TSettings } from "../types/types";
import { EventDispatcher } from "../helpers/eventDispatcher";
interface IPresenter {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;
    init(): void;
    updateView(): void;
    setData(name: string, data: any): void;
    fromPresenterUpdate: EventDispatcher;
    fromPresenterThumbUpdate: EventDispatcher;
    fromPresenterThumbSecondUpdate: EventDispatcher;
}
declare class SliderPresenter implements IPresenter {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;
    fromPresenterUpdate: EventDispatcher;
    fromPresenterThumbUpdate: EventDispatcher;
    fromPresenterThumbSecondUpdate: EventDispatcher;
    private min;
    private max;
    private step;
    private ifHorizontal;
    private ifRange;
    containerSize: number;
    thumbWidth: number;
    fromModelChangeViewHandler: {
        (newThumbValue: number): void;
    };
    fromModelUpdateDataHandler: {
        (data: TSettings): void;
    };
    fromViewSelectThumbHandler: {
        (newThumbValue: number): void;
    };
    fromViewDragThumbHandler: {
        (newThumbValue: number): void;
    };
    fromViewSortActionsHandler: {
        (flag: string, event: Event): void;
    };
    constructor(model: IModel, view: IView);
    init(): void;
    updateView(): void;
    private createChildren;
    private setupHandlers;
    private enable;
    private selectThumb;
    private selectThumbRangeFalse;
    private selectThumbRangeTrue;
    private dragThumb;
    private dragThumbRangeFalse;
    private dragThumbRangeTrue;
    private changeThumbInModel;
    private changeThumbSecondInModel;
    private changeThumbs;
    setData(name: string, data: any): void;
    private updateDataEverywhere;
}
export { IPresenter, SliderPresenter };
