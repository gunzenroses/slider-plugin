import { TLabelItem } from "../../types/types"

function labelItemView(args: TLabelItem): string {
    return (
        `   
            <span class="${args.labelItemClass}">${args.value}</span>
        `
    )
}

export { labelItemView }