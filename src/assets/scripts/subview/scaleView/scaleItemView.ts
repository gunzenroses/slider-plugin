import { applyStep, fromValueToPX } from "../../common"

function scaleItemView(ifHorizontal: boolean, containerSize: number, min: number, max: number, step: number, heightValue?: number, widthValue?: number){
    let scaleItemRow: number[] = [];
    let i=min;
    while (i<max){
        scaleItemRow.push(i);
        i+=step;
    }
    
    let pointHeight: string = ifHorizontal ? "height" : "width";
    let pointWidth: string = ifHorizontal ? "width" : "height";
    let pointHeightValue: number = heightValue ? heightValue : 3;
    let pointWidthValue: number = widthValue ? widthValue : 1;
    let pointStyle: string = `${pointHeight}: ${pointHeightValue}px; ${pointWidth}: ${pointWidthValue}px;`
    let pointSegmentStyle: string = `${pointHeight}: ${pointHeightValue*2}px; ${pointWidth}: ${pointWidthValue}px;`

    let itemClass: string = ifHorizontal ? "scale__point" : "scale__point_vertical";
    let borderType: string = ifHorizontal ? "left" : "top";
    let borderWidth: number = 1;
    let borderStyle: string = "" //`border-${borderType}: ${borderWidth}px solid black;`;
    let spanClass: string = ifHorizontal ? "scale__number" : "scale__number_vertical"

    let marginType: string = ifHorizontal ? "right" : "top";
    //let marginWidth: number = (max - (max - scaleItemRow[scaleItemRow.length]))/(scaleItemRow.length - 1) - borderWidth;
    
    let lengthOfLeft = (max + borderWidth) - scaleItemRow[scaleItemRow.length-1];
    let newContainerSize = containerSize - fromValueToPX(lengthOfLeft, max, min, containerSize)
    let marginWidth: number = (newContainerSize + borderWidth) / (scaleItemRow.length - 1) - borderWidth;

    let marginStyle: string = `margin-${marginType}: ${marginWidth}px;`;

    let maxStyle: string = `position: absolute; ${marginType}: 0;`;
    let scaleItemMax: string = `<div class=${itemClass} style="${maxStyle} ${borderStyle} ${pointSegmentStyle}""><span class="${spanClass}">${max}</span></div>`

    // let minStyle: string = `position: absolute; ${marginType}: 100%;`
    // let scaleItemMin: string = (scaleItemRow[0] === min)
    //                         ? ""
    //                         : `<div class=${itemClass} style="${minStyle} ${borderStyle} ${pointSegmentStyle}""><span class="${spanClass}">${min}</span></div>`

    let specialNums = (scaleItemRow.length+1) % 2 === 0
                ? 2
                : 3;

    function scaleMaker(item: number){
        return (
            (item === min || (item - min) % (specialNums*step) === 0) 
                ? `<div class=${itemClass} style="${marginStyle} ${borderStyle} ${pointSegmentStyle}""><span class="${spanClass}">${item}</span></div>`
                : `<div class=${itemClass} style="${marginStyle} ${borderStyle} ${pointStyle}""></div>`
        )
    }

    let scaleItemView = 
            scaleItemMax +
            scaleItemRow.map(item => scaleMaker(item)).join(" ");

    return scaleItemView;
}

export { scaleItemView }