import { EventDispatcher } from "./eventDispatcher";
import { IModelData, TSettings } from "utils/types";
interface IModel {
    fromModelChangeView: EventDispatcher;
    fromModelUpdateData: EventDispatcher;
    setData(name: string, data: IModelData): void;
    getData(): TSettings;
    getContainer(): HTMLElement;
}
declare class SliderModel implements IModel {
    private container;
    private data;
    fromModelChangeView: EventDispatcher;
    fromModelUpdateData: EventDispatcher;
    constructor(container: HTMLElement, settings: TSettings);
    private updateCurrentsWithStep;
    getContainer(): HTMLElement;
    getData(): TSettings;
    setData(name: string, data: IModelData): void;
    private changeThumb;
    private changeThumbSecond;
    private changeAll;
}
export { IModel, SliderModel };
