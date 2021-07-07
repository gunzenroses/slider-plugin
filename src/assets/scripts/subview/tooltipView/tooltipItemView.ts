function tooltipItemView(parentNode: HTMLElement, className: string, valueInPercents: number, ifHorizontal: boolean, valuePerPercent: number): HTMLElement {
    let verticalClass = ifHorizontal ? "" : "-vertical";
    let tooltip = document.createElement("span");
    tooltip.classList.add("tooltip", `${className}${verticalClass}`);
    tooltip.dataset.name = "tooltip";
    tooltip.innerText = Math.round(valueInPercents * valuePerPercent).toString();
    parentNode.append(tooltip);
    return tooltip;
}

export { tooltipItemView }