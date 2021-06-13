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

function changeRange(object: HTMLElement, newThumbCurrent: number, ifHorizontal: boolean, ifThumbFirst: boolean, ifFirst: boolean){
    ifThumbFirst
        ? ifHorizontal
                ? (ifFirst 
                    ? object.style.left = newThumbCurrent + "%"
                    : object.style.right = (100 - newThumbCurrent) + "%")
                : (ifFirst 
                    ? object.style.bottom = newThumbCurrent + "%"
                    : object.style.top = (100 - newThumbCurrent) + "%")
        : ifHorizontal
                ? object.style.right = (100 - newThumbCurrent) + "%"
                : object.style.top = (100 - newThumbCurrent) + "%";
    return object;
}

export { sliderRangeView, changeRange }