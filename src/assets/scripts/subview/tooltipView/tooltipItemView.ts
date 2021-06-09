import { applyStep } from "../../common"

function tooltipItemView(parentNode: HTMLElement, ifHorizontal: boolean, className: string, value: number, max: number, step: number): HTMLElement {
    let verticalClass = ifHorizontal ? "" : "-vertical";
    let tooltip = document.createElement("span");
    tooltip.classList.add("tooltip", `${className}${verticalClass}`);
    let newValue = Math.round(applyStep(value, max, step));
    tooltip.innerHTML = newValue.toString();
    parentNode.append(tooltip);
    return tooltip;
}

export { tooltipItemView }