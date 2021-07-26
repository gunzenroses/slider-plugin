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

export { TSettings, TDragObject, TRangeStyle }