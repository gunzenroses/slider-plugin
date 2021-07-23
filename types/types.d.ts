declare type TSettings = {
    [settingName: string]: any;
};
declare type TDragObject = {
    [settingName: string]: any;
};
declare type TRangeStyle = {
    newThumbCurrent: number;
    ifHorizontal: boolean;
    ifRange: boolean;
    ifThumbFirst: boolean;
};
export { TSettings, TDragObject, TRangeStyle };
