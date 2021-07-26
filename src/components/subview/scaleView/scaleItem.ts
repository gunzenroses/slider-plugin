
function scaleItem(item: number, sequenceNum: number, ifHorizontal: boolean, segmentClass: string, spanClass: string, min: number, max: number, step: number){
    let itemClass: string = ifHorizontal ? "scale__point" : "scale__point_vertical";
    
    return (
        (item === min || (item - min) % (sequenceNum*step) === 0) 
            ? `<div class=${segmentClass}><span class="${spanClass}">${item}</span></div>`
            : `<div class=${itemClass}></div>`
    )
}

export { scaleItem }