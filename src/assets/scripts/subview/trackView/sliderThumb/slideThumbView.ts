function sliderThumbView(parentNode: HTMLElement, className: string, ifHorizontal: boolean) {
    let verticalClass = ifHorizontal ? "" : "-vertical"
    let thumbClass = `${className}${verticalClass}`
    let sliderThumbView = document.createElement("div");
    sliderThumbView.classList.add("slider__thumb", thumbClass);
    parentNode.after(sliderThumbView);
    return sliderThumbView;
}

export { sliderThumbView };