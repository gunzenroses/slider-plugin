import { scaleItemView } from "./scaleItemView"
function scaleView(parentNode: HTMLElement, ifHorizontal: boolean, min: number, max: number, stepValue?: number): HTMLElement {
    let scaleClass: string = ifHorizontal
                ? "slider__scale"
                : "slider__scale_vertical";
    let step: number;
    console.log(stepValue)
    stepValue
            ? step = stepValue 
            : step = 1;
    let scale: HTMLElement = document.createElement("div");
    scale.classList.add(scaleClass);

    let scaleLength = ifHorizontal
                    ? Math.ceil(parseFloat(getComputedStyle(parentNode).width.replace("px","")))
                    : Math.ceil(parseFloat(getComputedStyle(parentNode).height.replace("px","")));

    scale.innerHTML = scaleItemView(ifHorizontal, scaleLength, min, max, step);
    

    parentNode.append(scale);
    return scale;
}

export { scaleView }