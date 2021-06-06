import { sliderThumbView } from "../sliderThumb/sliderThumbView"
import { sliderRangeView } from "../sliderRange/sliderRangeView"

function sliderTrackView(ifRange: boolean, ifHorizontal: boolean){
    let sliderTrackClass: string = ifHorizontal 
                                    ? "slider__track" 
                                    : "slider__track_vertical" ;
    return (
        `
            <div class=${sliderTrackClass}>
                ${sliderThumbView(ifRange, ifHorizontal)} 
                ${sliderRangeView(ifRange, ifHorizontal)}
            </div>
        `
    )
}

export { sliderTrackView }