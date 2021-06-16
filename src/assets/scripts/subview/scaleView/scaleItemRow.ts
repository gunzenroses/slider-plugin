import { fromValueToPX } from "../../common"
import { scaleItem } from "./scaleItem"

function scaleItemRow (ifHorizontal: boolean, containerSize: number, min: number, max: number, step: number, heightValue?: number, widthValue?: number){
    let scaleItemRow: number[] = [];
    let i=min;
    while (i<max){
        scaleItemRow.push(i);
        i+=step;
    }
    let segmentClass: string = ifHorizontal ? "scale__segment" : "scale__segment_vertical";
    let spanClass: string = ifHorizontal ? "scale__number" : "scale__number_vertical";

    let lengthOfLeft = max - scaleItemRow[scaleItemRow.length-1];
    let newContainerSize = containerSize - fromValueToPX(lengthOfLeft, max, min, containerSize) - 1;

    let scaleItems: HTMLElement = document.createElement("div");
    let scaleItemClass = ifHorizontal ? "scale__row" : "scale__row_vertical"
    scaleItems.classList.add(scaleItemClass);
    ifHorizontal
        ? scaleItems.style.width = newContainerSize + "px"
        : scaleItems.style.height = newContainerSize + "px";

    let marginType: string = ifHorizontal ? "right" : "top";
    let maxStyle: string = `position: absolute; ${marginType}: 0;`;
    let scaleItemMax: string = `<div class=${segmentClass} style="${maxStyle}""><span class="${spanClass}">${max}</span></div>`

    let specialNums = (scaleItemRow.length+1) % 2 === 0
                    ? 2
                    : 3;

    scaleItems.innerHTML = scaleItemRow.map(item => scaleItem(item, specialNums, ifHorizontal, segmentClass, spanClass, min, max, step)).join(" ") 
                        + scaleItemMax;

    return scaleItems;
}

export { scaleItemRow }