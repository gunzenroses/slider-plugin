class SliderContainer{
    constructor(containerId){
        this.sliderContainer = document.getElementById(containerId);
        this.sliderContainer.classList.add("slider__content");
        this.sliderContainer.innerHTML = "";
        return this.sliderContainer;
    }
}

export { SliderContainer }