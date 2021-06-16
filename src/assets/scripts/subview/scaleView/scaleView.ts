import { scaleItemRow} from "./scaleItemRow"

function scaleView(parentNode: HTMLElement, ifHorizontal: boolean, min: number, max: number, stepValue?: number): HTMLElement {
    let scaleClass: string = ifHorizontal
                ? "slider__scale"
                : "slider__scale_vertical";
    let step: number;
    stepValue
            ? step = stepValue 
            : step = 1;
    let scale: HTMLElement = document.createElement("div");
    scale.classList.add(scaleClass);
    
    let parentNodeStyle = getComputedStyle(parentNode);
    let scaleLength = ifHorizontal
                    ? Math.ceil(parseFloat(parentNodeStyle.width))
                    : Math.ceil(parseFloat(parentNodeStyle.height));

    scale.append(scaleItemRow(ifHorizontal, scaleLength, min, max, step));
    parentNode.append(scale);
    return scale;
}

export { scaleView }
