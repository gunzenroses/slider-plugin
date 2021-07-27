import { fromPercentsToValue } from "../../../scripts/utils/common"

export default function changeTooltip(object: HTMLElement, newThumbCurrent: number, max: number, min: number){
    object.innerText =  fromPercentsToValue(newThumbCurrent, max, min)   
    return object;
}