function sliderRangeView(parentNode: HTMLElement, ifRange: boolean, ifHorizontal: boolean){
    let sliderRangeClass: string = ifRange
                            ? (ifHorizontal ? "slider__range_true"
                                            : "slider__range_vertical-true")
                            : (ifHorizontal ? "slider__range"
                                            : "slider__range_vertical")
    let sliderRange = document.createElement("div");
    sliderRange.classList.add(`${sliderRangeClass}`);
    parentNode.append(sliderRange);
    return sliderRange;
}

export { sliderRangeView }