function tooltipRowView(parentNode: HTMLElement, ifHorizontal: boolean)
                    : HTMLElement {
    let tooltipRowClass: string = ifHorizontal 
                            ? "slider__tooltip" 
                            : "slider__tooltip_vertical";
    let tooltipRow = document.createElement("div");
    tooltipRow.classList.add(tooltipRowClass);
    parentNode.append(tooltipRow);
    return tooltipRow;
}

export { tooltipRowView }