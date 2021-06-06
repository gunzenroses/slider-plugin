import { labelItemView } from "./labelItemView"
import { TLabelItem } from "../../types/types"

function labelView(ifRange: boolean, ifHorizontal: boolean, 
                    currentFirst: number, currentSecond: number)
                    : string {
    let labelRowClass: string = ifHorizontal 
                            ? "slider__label" 
                            : " slider__label_vertical";
    let verticalClass = ifHorizontal ? "" : "-vertical";
    let labelItems: TLabelItem[] = ifRange
                                ? [{labelItemClass: `label label_first${verticalClass}`, value: currentFirst},
                                    {labelItemClass: `label label_second${verticalClass}`, value: currentSecond}]
                                : [{labelItemClass: `label label_first${verticalClass}`, value: currentFirst}]

    return (
        `   
            <div class="${labelRowClass}">
                ${labelItems.map(item => labelItemView(item)).join("")}
            </div> 
        `
    )
}

export { labelView }