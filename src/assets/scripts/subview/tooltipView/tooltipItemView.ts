function tooltipItemView(parentNode: HTMLElement, ifHorizontal: boolean, className: string, value: number): HTMLElement {
    let verticalClass = ifHorizontal ? "" : "-vertical";
    let tooltip = document.createElement("span");
    tooltip.classList.add("tooltip", `${className}${verticalClass}`);
    tooltip.innerHTML = value.toString();
    parentNode.append(tooltip);
    return tooltip;
}

export { tooltipItemView }