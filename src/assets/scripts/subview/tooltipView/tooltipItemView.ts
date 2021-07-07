import { changeTooltip } from "./changeTooltip";

function tooltipItemView(parentNode: HTMLElement, className: string, actualValue: number, ifHorizontal: boolean, maxValue: number, minValue: number): HTMLElement {
    let verticalClass = ifHorizontal ? "tooltip_horizontal" : "tooltip_vertical";
    let tooltip = document.createElement("span");
    tooltip.classList.add(className, verticalClass);
    tooltip.dataset.name = "tooltip";

    changeTooltip(tooltip, actualValue, maxValue, minValue);
    console.log(tooltip.innerText)
    parentNode.append(tooltip);
    return tooltip;
}

export { tooltipItemView }