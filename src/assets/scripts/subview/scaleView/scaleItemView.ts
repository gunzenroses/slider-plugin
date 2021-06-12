function scaleItemView(ifHorizontal: boolean, scaleLength: number, min: number, max: number, step: number, heightValue?: number, widthValue?: number){
    let scaleItemRow: number[] = [];
    for (let i=min; i<max; i++){
        if (i%step === 0){
            scaleItemRow.push(i);
        }
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
    let marginWidth: number = scaleLength / scaleItemRow.length - borderWidth;
    let marginStyle: string = `margin-${marginType}: ${marginWidth}px;`;

    let maxStyle: string = `position: absolute; ${marginType}: 0;`;
    let scaleItemMax: string = `<div class=${itemClass} style="${maxStyle} ${borderStyle} ${pointSegmentStyle}""><span class="${spanClass}">${max}</span></div>`

    function scaleMaker(item: number){
        return (
            (item % (10*step) === 0) 
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