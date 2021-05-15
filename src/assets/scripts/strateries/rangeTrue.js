import { SliderContainer } from "../subviews/SliderContainer"
import { SliderTrack } from "../subviews/SliderTrack"
import { SliderThumb } from "../subviews/SliderThumb"
import { SliderRange } from "../subviews/SliderRange"

class RangeTrue {
    constructor(context, containerId){
        context.sliderContainer = new SliderContainer(containerId);
        context.sliderTrack = new SliderTrack();
            context.sliderContainer.prepend(context.sliderTrack);
        context.sliderThumb = new SliderThumb("thumb_first")
            context.sliderContainer.append(context.sliderThumb);
        context.sliderThumbSecond = new SliderThumb("thumb_second")
            context.sliderContainer.append(context.sliderThumbSecond);
        context.sliderRange = new SliderRange("slider__range_true");
            context.sliderContainer.append(context.sliderRange);
        return context;
    }
}

export { RangeTrue }