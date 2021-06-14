import { applyStep, applyRestrictions } from "../../../common"
import { changeThumb } from "./changeThumb"

function sliderThumbView(parentNode: HTMLElement, className: string, ifHorizontal: boolean, max: number, step: number) {
    let verticalClass = ifHorizontal ? "" : "-vertical"
    let thumbClass = `${className}${verticalClass}`
    let sliderThumbView = document.createElement("div");
    sliderThumbView.classList.add("slider__thumb", thumbClass);
    
    let posTemp = (className === "thumb_first")
                    ? 33
                    : 66;
    let posChecked = applyRestrictions(applyStep(posTemp, max, step));
    changeThumb(sliderThumbView, ifHorizontal, posChecked)

    parentNode.append(sliderThumbView);
    return sliderThumbView;
}

export { sliderThumbView };