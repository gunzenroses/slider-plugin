import { applyStep, fromPercentsToValue } from "../../common"

function tooltipItemView(parentNode: HTMLElement, className: string, value: number, ifHorizontal: boolean, max: number, min: number, step: number): HTMLElement {
    let verticalClass = ifHorizontal ? "" : "-vertical";
    let tooltip = document.createElement("span");
    tooltip.classList.add("tooltip", `${className}${verticalClass}`);
    tooltip.dataset.name = "tooltip";
    let newValue = Math.round(applyStep(value, max, min, step)) > max
                    ? max
                    : Math.round(applyStep(value, max, min, step));

    tooltip.innerText = fromPercentsToValue(newValue, max, min);
    
    parentNode.append(tooltip);
    return tooltip;
}

export { tooltipItemView }