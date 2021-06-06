function sliderRangeView(ifRange: boolean, ifHorizontal: boolean){
    let sliderRangeClass: string = ifRange
                            ? (ifHorizontal ? "slider__range_true"
                                            : "slider__range_vertical-true")
                            : (ifHorizontal ? "slider__range"
                                            : "slider__range_vertical")
    return (
        `
        <div class="${sliderRangeClass}"></div>
        `
    )
}

export { sliderRangeView }