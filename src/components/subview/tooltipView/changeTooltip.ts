import { fromPercentsToValue } from "../../../scripts/helpers/common"

export default function changeTooltip(object: HTMLElement, newThumbCurrent: number, max: number, min: number){
    object.innerText =  fromPercentsToValue(newThumbCurrent, max, min)   
    return object;
}