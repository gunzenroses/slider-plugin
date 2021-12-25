import { TOrient, TSettings } from "Utils/types";

const initialData: TSettings = {
  min: 0,
  max: 100,
  range: true,
  currentFirst: 33,
  currentSecond: 65,
  step: 1,
  orientation: TOrient.HORIZONTAL,
  tooltip: true,
  scale: true,
};

export { initialData };
