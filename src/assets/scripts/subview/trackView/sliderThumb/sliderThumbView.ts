import { sliderThumbItem } from "./slideThumbItem"

function sliderThumbView(ifRange: boolean, ifHorizontal: boolean) {
    let sliderRow = [];
    ifRange
        ? sliderRow.push("thumb_first", "thumb_second")
        : sliderRow.push("thumb_first")

    return (
        `${sliderRow.map(item => sliderThumbItem(item, ifHorizontal)).join("")}`
    )
}

export { sliderThumbView };