import { TSettings } from "Utils/types";

const initialData: TSettings = {
  min: 0,
  max: 100,
  range: true,
  currentFirst: 33,
  currentSecond: 65,
  step: 1,
  orientation: "horizontal",
  tooltip: true,
  scale: {
    stepPerDiv: 10,
  },
};

export { initialData };
