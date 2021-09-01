declare type IModelData = boolean | number | string;
declare type TScale = {
    stepPerDiv: number;
};
declare type TSettings = {
    [key: string]: any;
};
declare type TRangeStyle = {
    newThumbCurrent: number;
    ifHorizontal: boolean;
    ifRange: boolean;
    ifThumbFirst: boolean;
};
declare type TListType = number | PointerEvent | null;
declare type TListener = (arg1: TListType) => void;
declare type TPanelParam = {
    name: string;
    text: string;
    value: string | number;
    type: string;
    options?: Array<string>;
};
declare type TFuncArg = PointerEvent | number;
declare type TFunc = (arg1?: TFuncArg) => void;
export { TScale, TSettings, IModelData, TRangeStyle, TListener, TPanelParam, TFuncArg, TFunc };
