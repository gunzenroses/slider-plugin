function sliderRangeView(ifRange: boolean, ifHorizontal: boolean){
    let sliderRangeClass: string = ifRange
                            ? (ifHorizontal ? "slider__range_true"
                                            : "slider__range_vertical-true")
                            : (ifHorizontal ? ""
                                            : "slider__range_vertical")
    // let sliderRangeClass: string = ifHorizontal
    //                         ? ( ifRange ? "slider__range_true" 
    //                                     : "")
    //                         : ( ifRange ? "slider__range_vertical-true" 
    //                                     : "slider__range_vertical");
    return (
        `
        <div class="slider__range ${sliderRangeClass}"></div>
        `
    )
}

export { sliderRangeView }