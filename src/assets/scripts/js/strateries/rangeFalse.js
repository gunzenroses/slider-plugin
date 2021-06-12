import { SliderContainer } from "../subviews/SliderContainer"
import { SliderTrack } from "../subviews/SliderTrack"
import { SliderThumb } from "../subviews/SliderThumb"
import { SliderRange } from "../subviews/SliderRange"

class RangeFalse {
    constructor(context, containerId){
        context.sliderContainer = new SliderContainer(containerId);
        context.sliderTrack = new SliderTrack();
            context.sliderContainer.prepend(context.sliderTrack);
        context.sliderThumb = new SliderThumb("thumb_first")
            context.sliderContainer.append(context.sliderThumb);
        context.sliderRange = new SliderRange("slider__range");
            context.sliderContainer.append(context.sliderRange);
        return context;
    }
}

export { RangeFalse }