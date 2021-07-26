import { scaleItemRow} from "./scaleItemRow"

function scaleView(parentNode: HTMLElement, ifHorizontal: boolean, max: number, min: number,  step: number, stepPerDiv?: number): HTMLElement {
    let scaleClass: string = ifHorizontal
                ? "slider__scale"
                : "slider__scale_vertical";

    let scale: HTMLElement = document.createElement("div");
    scale.dataset.name = "scale";
    scale.classList.add(scaleClass);
    
    let parentNodeStyle = getComputedStyle(parentNode);
    let scaleLength = ifHorizontal
                    ? Math.ceil(parseFloat(parentNodeStyle.width))
                    : Math.ceil(parseFloat(parentNodeStyle.height));

    let stepPerDivValue = stepPerDiv
                    ? stepPerDiv
                    : ((scaleItemRow.length+1) % 2 === 0)
                        ? 2
                        : 3;

    scale.append(scaleItemRow(ifHorizontal, scaleLength, min, max, step, stepPerDivValue));
    parentNode.append(scale);
    return scale;
}

export { scaleView }
