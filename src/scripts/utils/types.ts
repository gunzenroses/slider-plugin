type IModelData = boolean | number | string;

type TScale = {
  stepPerDiv: number;
};

type TSettings = {
  [key: string]: any;
};

type TRangeStyle = {
  newThumbCurrent: number;
  ifHorizontal: boolean;
  ifRange: boolean;
  ifThumbFirst: boolean;
};

type TListType = number | PointerEvent | null;

type TListener = (arg1: TListType) => void;

type TPanelParam = {
  name: string;
  text: string;
  value: string | number;
  type: string;
  options?: Array<string>;
};

type TFuncArg = PointerEvent | number;
type TFunc = (arg1?: TFuncArg) => void;

export { TScale, TSettings, IModelData, TRangeStyle, TListener, TPanelParam, TFuncArg, TFunc };
