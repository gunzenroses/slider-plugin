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

type TListener<T> = <K extends keyof T>(args: T[K]) => void;

type TListenerArr<T> = Record<keyof T, TListener<T>[]>;

type TPresenterObservable = {
  'currentFirstDataUpdated': number,
  'currentSecondDataUpdated': number,
  'allDataUpdated': TSettings
};

type TModelObservable = {
  'updateDataCurrentFirst': number,
  'updateDataCurrentSecond': number,
  'updateData': TSettings
};

type TViewObservable = {
  'changeFirstThumb': number,
  'changeSecondThumb': number
};

type TSMObservable = {
  'allDataUpdated': TSettings | string,
  'updateThumb': number,
  'updateThumbSecond': number
};

type TObservable = TModelObservable & TViewObservable & TPresenterObservable;

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

type TAddListener = { (eventKey: string, listener: TListener): void };

type TRange = {
  element: HTMLElement;
  change(settings: TViewSettings): void;
};

type TTooltip = {
  element: HTMLElement;
  change(value: number): void;
};

type TSubviewData = { 
  container: HTMLElement, 
  settings: TViewSettings
};

type TThumbs = {
  thumbFirst: HTMLElement;
  thumbSecond: HTMLElement;
  change(settings: TViewSettings): void;
  listenPointerDown(range: boolean, method: { (e: PointerEvent): void });
  stopListenPointerDown(range: boolean, method: { (e: PointerEvent): void });
};
