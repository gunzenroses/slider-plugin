type TModelData = boolean | number | string;

type TDataInfo = {
  type: string | null,
  name: string,
  data: TModelData
};

type TArrayOfEntries = Array<[string, TModelData]>;

type TFromValueToPercents = {
  value: number,
  min: number,
  max: number,
  step: number
};

type TListenerArg = any;
/*
  TListenerArg may have a type:
    'IView', 'number', 'Event', 'TSettings', 'undefined', etc.
  which makes type checking excessively complicated
*/

type TListener = (args: TListenerArg) => void;

type TListenerArr = {
  [eventKey: string]: Array<TListener>;
};

type TPanelParam = {
  name: string;
  text: string;
  value: string | number;
  type: string;
  options?: Array<string>;
};

type TScaleItemData = {
  ifHorizontal: boolean;
  min: number;
  max: number;
  step: number;
  toFixedDecimals: number;
};

type TScaleItemSettings = {
  item: number;
  direction: string;
  min: number;
  max: number;
  step: number;
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

type TTrackElementsData = {
  container: HTMLElement,
  eventDispatcher: IObservable,
  settings: TViewSettings
}
