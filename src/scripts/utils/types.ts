import { IView } from "mvp/View/View";

type IModelData = boolean | number | string;

type TListType = number | PointerEvent | null;

type TListener = (arg1: TListType) => void;

type TRangeStyle = {
  newThumbCurrent: number;
  ifHorizontal: boolean;
  ifRange: boolean;
  ifThumbFirst: boolean;
};

type TPanelParam = {
  name: string;
  text: string;
  value: string | number;
  type: string;
  options?: Array<string>;
};

type TSettings = {
  [key: string]: any;
};

type TScale = {
  stepPerDiv: number;
};

type TScaleItem = {
  width: number;
  stepPerDiv: number;
  segmentClass: string;
  spanClass: string;
};

type TScaleOptions = {
  item: number;
  index: number;
  that: IView;
};

type TFuncArg = Event | string | number;

type TFunc = (arg1?: TFuncArg) => void;

export {
  TScale,
  TSettings,
  IModelData,
  TRangeStyle,
  TListener,
  TPanelParam,
  TScaleOptions,
  TScaleItem,
  TFuncArg,
  TFunc,
};
