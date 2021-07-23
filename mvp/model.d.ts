import { TSettings } from "../types/types";
import { EventDispatcher } from '../helpers/eventDispatcher';
interface IModel {
    fromModelChangeView: EventDispatcher;
    fromModelUpdateData: EventDispatcher;
    setData(name: string, data: any): void;
    getData(): TSettings;
    getContainerId(): string;
    changeThumb(value: number): void;
    changeThumbSecond(value: number): void;
}
declare class SliderModel implements IModel {
    private containerId;
    private data;
    fromModelChangeView: EventDispatcher;
    fromModelUpdateData: EventDispatcher;
    constructor(containerId: string, settings: TSettings);
    private updateCurrentsWithStep;
    getContainerId(): string;
    getData(): TSettings;
    setData(name: string, data: any): void;
    changeThumb(value: number): void;
    changeThumbSecond(value: number): void;
}
export { IModel, SliderModel };
