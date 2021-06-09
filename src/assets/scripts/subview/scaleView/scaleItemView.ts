function scaleItemView(ifHorizontal: boolean, scaleLength: number, min: number, max: number, step: number, heightValue?: number, widthValue?: number){
    let scaleItemRow: number[] = [];
    for (let i=min; i<max; i++){
        if (i%step === 0){
            scaleItemRow.push(i);
        }
    }
    scaleItemRow.push(max);
    
    let pointHeight: string = ifHorizontal ? "height" : "width";
    let pointWidth: string = ifHorizontal ? "width" : "height";
    let height: number = heightValue ? heightValue : 3;
    let width: number = widthValue ? widthValue : 1;
    let pointStyle = `${pointHeight}: ${height}px; ${pointWidth}: ${width}px;`

    let itemClass: string = ifHorizontal ? "scale__point" : "scale__point_vertical";
    let borderType: string = ifHorizontal ? "left" : "top";
    let borderWidth: number = 1;
    let borderStyle = `border-${borderType}: ${borderWidth}px solid black;`;

    // function scaleMaker(item: number){
    //     return (
    //         (item%10 === 0) 
    //             ? ``
    //             : "<div class=${itemClass} style="${borderStyle}"></div>"
    //     )
    // }

    let scaleItemView = 
            scaleItemRow.map(function(item){
                return (
                `<div class=${itemClass} style="${borderStyle} ${pointStyle}"></div>`
                )
            }).join(" ");
    return scaleItemView;
}

export { scaleItemView }