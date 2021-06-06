function sliderTrackView(ifHorizontal: boolean){
    let sliderTrackClass: string = ifHorizontal 
                                    ? "slider__track" 
                                    : "slider__track_vertical" ;
    return (
        `
            <div class=${sliderTrackClass}>
        `
    )
}

export { sliderTrackView }