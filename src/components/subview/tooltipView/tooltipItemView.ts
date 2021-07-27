import { changeTooltip } from "./changeTooltip";

export default function tooltipItemView(parentNode: HTMLElement, className: string, valueInPercents: number, ifHorizontal: boolean, maxValue: number, minValue: number): HTMLElement {
    let verticalClass = ifHorizontal ? "tooltip_horizontal" : "tooltip_vertical";
    let tooltip = document.createElement("span");
    tooltip.classList.add(className, verticalClass);
    tooltip.dataset.name = "tooltip";

    changeTooltip(tooltip, valueInPercents, maxValue, minValue);
    parentNode.append(tooltip);
    return tooltip;
}