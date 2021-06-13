function sliderThumbView(parentNode: HTMLElement, className: string, ifHorizontal: boolean) {
    let verticalClass = ifHorizontal ? "" : "-vertical"
    let thumbClass = `${className}${verticalClass}`
    let sliderThumbView = document.createElement("div");
    sliderThumbView.classList.add("slider__thumb", thumbClass);
    
    parentNode.append(sliderThumbView);
    return sliderThumbView;

    //applyStep(newThumbValue, max, step);
    //findPosition
}


function changeThumb(object: any, ifHorizontal: boolean, newThumbCurrent: number){
    ifHorizontal
                ? object.style.left = newThumbCurrent + "%"
                : object.style.bottom = newThumbCurrent + "%";
    return object;
}

export { sliderThumbView, changeThumb };