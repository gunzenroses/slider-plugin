class SliderRange {
    constructor(className){
        this.sliderRange = document.createElement("div");
        this.sliderRange.classList.add(className);
        return this.sliderRange;
    }
}

export { SliderRange }