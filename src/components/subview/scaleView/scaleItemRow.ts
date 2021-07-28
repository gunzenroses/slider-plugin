import { fromValueToPX } from "../../../scripts/utils/common"
import scaleItem from "./scaleItem"

export default function scaleItemRow (ifHorizontal: boolean, containerSize: number, min: number, max: number, step: number, stepPerDiv: number){
    //find the row of elements (with step)
    let scaleItemRow: number[] = [];
    let i=min;
    while (i<max){
        scaleItemRow.push(i);
        i+=step;
    }

    //determine classes for elements
    let segmentClass: string = ifHorizontal ? "scale__segment" : "scale__segment_vertical";
    let spanClass: string = ifHorizontal ? "scale__number" : "scale__number_vertical";
    let scaleItemClass = ifHorizontal ? "scale__row" : "scale__row_vertical";

    //to find the length of row of divisions (exc the max value)
    let lengthOfLeft = max - scaleItemRow[scaleItemRow.length-1];
    let newContainerSize = containerSize - fromValueToPX(lengthOfLeft, max, min, containerSize) - 1;

    //creation of row of items
    let scaleItems: HTMLElement = document.createElement("div");
    scaleItems.classList.add(scaleItemClass);
    ifHorizontal
        ? scaleItems.style.width = newContainerSize + "px"
        : scaleItems.style.height = newContainerSize + "px";

    //special style for item with max value
    let marginType: string = ifHorizontal ? "right" : "top";
    let maxStyle: string = `position: absolute; ${marginType}: 0;`;
    let scaleItemMax: string = `<div class=${segmentClass} style="${maxStyle}""><span class="${spanClass}">${max}</span></div>`

    scaleItems.innerHTML = scaleItemRow.map(item => scaleItem(item, stepPerDiv, ifHorizontal, segmentClass, spanClass, min, max, step)).join(" ") 
                        + scaleItemMax;

    return scaleItems;
}