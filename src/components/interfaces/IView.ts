import { TSettings, TViewSettings } from "Utils/types";
import IObservable from "./IObservable";
import ISubview from "./ISubview";

export default interface IView {
    settings: TViewSettings;
    sliderContainer: HTMLElement;
    thumb: ISubview;
    thumbSecond: ISubview;
    track: HTMLElement;
    range: ISubview;
    scale: HTMLElement;
    tooltipFirst: ISubview;
    tooltipSecond: ISubview;
    dragObj: HTMLElement | null;

    eventDispatcher: IObservable;
  
    init(settings: TSettings): void;
    enable(): void;
    selectThumb(e: PointerEvent): void;
    dragThumbStart(e: PointerEvent): void;
    dragThumbEnd(): void;
    changeFirstThumb(val: number): void;
    changeSecondThumb(val: number): void;
  }