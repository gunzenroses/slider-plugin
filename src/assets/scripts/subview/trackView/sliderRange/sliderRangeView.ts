import { changeRange } from "./changeRange"
import { applyStep } from "../../../common"
import { TRangeStyle } from "../../../types/types";

function sliderRangeView(parentNode: HTMLElement, ifRange: boolean, ifHorizontal: boolean, max: number, min: number, step: number){
    let sliderRangeClass: string = ifRange
                            ? (ifHorizontal ? "slider__range-true"
                                            : "slider__range_vertical-true")
                            : (ifHorizontal ? "slider__range"
                                            : "slider__range_vertical")
    let sliderRange = document.createElement("div");
    sliderRange.classList.add(`${sliderRangeClass}`);

    let rangeRow: TRangeStyle[] = [];
    switch (String(sliderRangeClass)){
        case "slider__range": rangeRow = [
            {
                newThumbCurrent: 0, 
                ifHorizontal: true, 
                ifRange: true, 
                ifThumbFirst: true
            }, 
            {
                newThumbCurrent: 66, 
                ifHorizontal: true, 
                ifRange: true, 
                ifThumbFirst: false}
            ]; 
            break;
        case "slider__range-true": rangeRow = [
            {
                newThumbCurrent: 33, 
                ifHorizontal: true, 
                ifRange: true, 
                ifThumbFirst: true
            }, 
            {
                newThumbCurrent: 66, 
                ifHorizontal: true, 
                ifRange: true, 
                ifThumbFirst: false}
            ]; 
            break;
        case "slider__range_vertical": rangeRow = [
            {
                newThumbCurrent: 0, 
                ifHorizontal: false, 
                ifRange: true, 
                ifThumbFirst: true
            }, 
            {
                newThumbCurrent: 66, 
                ifHorizontal: false, 
                ifRange: true, 
                ifThumbFirst: false}
            ]; 
            break;
        case "slider__range_vertical-true": rangeRow = [
            {
                newThumbCurrent: 33, 
                ifHorizontal: false, 
                ifRange: true, 
                ifThumbFirst: true
            }, 
            {
                newThumbCurrent: 66, 
                ifHorizontal: false, 
                ifRange: true, 
                ifThumbFirst: false}
            ]; 
            break;
    }

    rangeRow.forEach(item => changeRange(sliderRange, applyStep(item.newThumbCurrent, max, min, step), item.ifHorizontal, item.ifRange, item.ifThumbFirst))
    
    parentNode.append(sliderRange);
    return sliderRange;
}

export { sliderRangeView }