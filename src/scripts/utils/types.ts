type TSettings = {
    [settingName: string]: any;
}

// type TSettings = {
//     min: number,
//     max: number,
//     range: boolean,
//     currentFirst: number,
//     currentSecond: number,
//     step: number,
//     orientation: string,
//     tooltip: boolean,
//     scale: boolean,
// }

type TDragObject = {
    [settingName: string]: any;
}

type TRangeStyle = {
    newThumbCurrent: number, 
    ifHorizontal: boolean, 
    ifRange: boolean, 
    ifThumbFirst: boolean
};

type TPanelParam = {
    name: string,
    text: string, 
    value: string,
    type: string,
    options?: Array<String>,
}

export { TSettings, TDragObject, TRangeStyle, TPanelParam }