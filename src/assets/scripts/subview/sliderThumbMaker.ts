function sliderThumbMaker(className: string) {
    //let thumbClass: string = className;
    return (
        `
            <div class="slider__thumb ${className}"></div> 
        `
    )
}

export { sliderThumbMaker };