class SliderThumb{
    constructor(className){
        this.sliderThumb = document.createElement("div");
        this.sliderThumb.classList.add("slider__thumb", className);
        return this.sliderThumb;
    }
}

export { SliderThumb }