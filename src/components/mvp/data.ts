import { TSettings } from "../../scripts/types/types"

let sliderData: TSettings = {
    min: 0,
    max: 100,
    range: true,
    currentFirst: 33,
    currentSecond: 66,
    step: 1,
    orientation: "horizontal",
    tooltip: true,
    scale: {
        stepPerDiv: 10,
    }
}

export { sliderData }