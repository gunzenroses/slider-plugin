import { IView } from "mvp/View/View";

type TListenerArg = Event | string | number;

type TListener = (arg1?: TListenerArg) => void;

type TListenerArr = {
  [eventKey: string]: Array<TListener>
}

type IModelData = boolean | number | string;

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

export {
  IModelData,
  TListenerArg,
  TListener,
  TListenerArr,
  TPanelParam,
  TRangeStyle,
  TScale,
  TScaleOptions,
  TScaleItem,
  TSettings,
};
