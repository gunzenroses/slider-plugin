function sliderThumbView(parentNode: HTMLElement, className: string, ifHorizontal: boolean) {
    let verticalClass = ifHorizontal ? "" : "-vertical"
    let thumbClass = `${className}${verticalClass}`
    let sliderThumbView = document.createElement("div");
    sliderThumbView.classList.add("slider__thumb", thumbClass);
    
    parentNode.append(sliderThumbView);
    return sliderThumbView;

    //findPosition
    //applyStep(newThumbValue, max, step);
    //changeThumb(object: any, ifHorizontal: boolean, newThumbCurrent: number)
}

export { sliderThumbView };