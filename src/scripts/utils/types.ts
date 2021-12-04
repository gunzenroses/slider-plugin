import { IView } from "mvp/View/View";

const TOrient = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
}

type TListenerArg = any;

type TListener = (arg1: TListenerArg) => void;

type TListenerArr = {
  [eventKey: string]: Array<TListener>
}

type TModelData = boolean | number | string;

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

type TScale = { stepPerDiv: number } | boolean;

type TSettings = {
  min: number,
  max: number,
  range: boolean,
  currentFirst: number,
  currentSecond: number,
  step: number,
  orientation: string,
  tooltip: boolean,
  scale: TScale,
}

type TViewSettings = TSettings & {
  ifHorizontal: boolean,
  firstPosition: number,
  secondPosition: number,
}

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
  TModelData,
  TListenerArg,
  TListener,
  TListenerArr,
  TPanelParam,
  TRangeStyle,
  TScale,
  TScaleOptions,
  TScaleItem,
  TOrient,
  TSettings,
  TViewSettings,
};
