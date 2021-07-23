import { fromPercentsToValue } from "../../helpers/common"

function changeTooltip(object: HTMLElement, newThumbCurrent: number, max: number, min: number){
    object.innerText =  fromPercentsToValue(newThumbCurrent, max, min)   
    return object;
}

export { changeTooltip }