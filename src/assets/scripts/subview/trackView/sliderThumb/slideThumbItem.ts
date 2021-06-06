function sliderThumbItem(className: string, ifHorizontal: boolean) {
    let verticalClass = ifHorizontal ? "" : "-vertical"
    let thumbClass = `${className}${verticalClass}`
    
    return (
        `
            <div class="slider__thumb ${thumbClass}"></div> 
        `
    )
}

export { sliderThumbItem };