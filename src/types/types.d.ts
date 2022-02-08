type TModelData = boolean | number | string;

type TDataInfo = {
  type: string | null,
  name: string,
  data: TModelData
};

type TListenerArg = any;
/*
  TListenerArg may have a type:
    'IView', 'number', 'Event', 'TSettings', 'undefined', etc.
  which makes type cheking excessively complicated
*/

type TListener = (args: TListenerArg) => void;

type TListenerArr = {
  [eventKey: string]: Array<TListener>;
};

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
  min: number;
  max: number;
  range: boolean;
  currentFirst: number;
  currentSecond: number;
  step: number;
  orientation: string;
  tooltip: boolean;
  scale: boolean;
};

type TViewSettings = TSettings & {
  ifHorizontal: boolean;
  firstPosition: number;
  secondPosition: number;
};

type TScaleItem = {
  width: number;
  stepPerDiv: number;
  segmentClass: string;
  spanClass: string;
};