import { TSettings } from "Utils/types";
import IObservable from "./IObservable";
import ISubview from "./ISubview";

export default interface IView {
    settings: TSettings;
    sliderContainer: HTMLElement;
    thumb: ISubview;
    thumbSecond: ISubview;
    track: HTMLElement;
    range: ISubview;
    scale: HTMLElement;
    tooltipFirst: ISubview;
    tooltipSecond: ISubview;
    dragObj: HTMLElement | null;
  
    fromViewSelectThumb: IObservable;
    fromViewDragThumb: IObservable;
  
    init(settings: TSettings): void;
    change(object: HTMLElement, newThumbCurrent: number): void;
    selectThumb(e: PointerEvent): void;
    dragThumbStart(e: PointerEvent): void;
    dragThumbEnd(): void;
  }