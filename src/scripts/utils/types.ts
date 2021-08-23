type TSettings = {
  [settingName: string]: boolean | number | string;
};

// type TSettings = {
//     min: number,
//     max: number,
//     range: boolean,
//     currentFirst: number,
//     currentSecond: number,
//     step: number,
//     orientation: string,
//     tooltip: boolean,
//     scale: boolean,
// }

type TDragObject = {
  [settingName: string]: boolean | number | string;
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
  value: string;
  type: string;
  options?: Array<string>;
};

export { TSettings, TDragObject, TRangeStyle, TPanelParam };
