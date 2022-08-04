type TSetData = boolean | number | string;

type TDataInfo = {
  type: string | null;
  name: string;
  data: TSetData;
};

type TArrayOfEntries = Array<[string, TSetData]>;

type TFromValueToPercents = {
  value: number;
  min: number;
  max: number;
  step: number;
};

type TListener<T> = (args: T) => void;

type TListenerArr<T> = {
  [K in keyof T]: TListener<T[K]>[];
};

type TViewObservable = {
  changeFirstThumb: number;
  changeSecondThumb: number;
};

type TThumbObservable = {
  dragThumb: {
    element: HTMLElement;
    event: PointerEvent;
  }
};

type TPresenterObservable = {
  updateCurrentFirstPosition: number;
  updateCurrentSecondPosition: number;
  updateAllPositions: TSettings;
};

type TModelObservable = {
  updateCurrentFirstData: number;
  updateCurrentSecondData: number;
  updateAllData: TSettings;
};

type TSMObservable = {
  updateData: TSettings | string;
  updateThumb: number;
  updateThumbSecond: number;
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
  container: HTMLElement;
  settings: TViewSettings;
};
