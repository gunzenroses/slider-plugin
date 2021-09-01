import { IModelData, TSettings } from "utils/types";
import { applyStepOnValue } from "utils/common";

export default function adjustValue(name: string, value: IModelData, data: TSettings): number {
  const { max, min, step, currentFirst, currentSecond }: TSettings = data;
  const val = parseInt(value as string);

  switch (name) {
    case "step":
      value = adjustStep(val);
      break;
    case "min":
      value = adjustMin(val);
      break;
    case "max":
      value = adjustMax(val);
      break;
    case "currentFirst":
      value = adjustCurrentFirst(val);
      break;
    case "currentSecond":
      value = adjustCurrentSecond(val);
      break;
    default:
      value = adjustAsIs(val);
      break;
  }

  function adjustMin(value: number): number {
    return value < 0 ? 0 : value <= max - step ? value : 1;
  }

  function adjustMax(value: number): number {
    return value < 0 ? min + step : value >= min + step ? value : min + step;
  }

  function adjustStep(value: number): number {
    return value < 0 ? 1 : value > max - min ? max - min : value < max - min ? value : 1;
  }

  function adjustCurrentFirst(value: number): number {
    return value < min
      ? min
      : value > currentSecond
      ? currentSecond
      : value >= min && value <= currentSecond
      ? applyStepOnValue(value, max, min, step)
      : min;
  }

  function adjustCurrentSecond(value: number): number {
    return value < currentFirst
      ? currentFirst
      : value > max
      ? max
      : value >= currentFirst && value <= max
      ? applyStepOnValue(value, max, min, step)
      : currentFirst;
  }

  function adjustAsIs(value: number) {
    return value;
  }

  return value;
}
