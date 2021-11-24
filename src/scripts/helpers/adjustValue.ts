import { IModelData, TSettings } from "Utils/types";
import { applyStepOnValue } from "Utils/common";

export default function adjustValue(name: string, value: IModelData, data: TSettings): IModelData {
  const { max, min, step, currentFirst, currentSecond }: TSettings = data;
  const val = value as string;

  switch (name) {
    case "step":
      value = adjustStep(parseInt(val));
      break;
    case "min":
      value = adjustMin(parseInt(val));
      break;
    case "max":
      value = adjustMax(parseInt(val));
      break;
    case "currentFirst":
      value = adjustCurrentFirst(parseInt(val));
      break;
    case "currentSecond":
      value = adjustCurrentSecond(parseInt(val));
      break;
    default:
      value = adjustAsIs(val);
      break;
  }

  function adjustMin(value: number): number {
    return value < 0 ? 0 : value <= max - step ? value : 0;
  }

  function adjustMax(value: number): number {
    return value < 0 ? min + step : value >= min + step ? value : min + step;
  }

  function adjustStep(value: number): number {
    return value <= 0
      ? 1
      : value > max - min
      ? max - min
      : value < max - min
      ? value
      : value === max - min
      ? max - min
      : 1;
  }

  function adjustCurrentFirst(value: number): number {
    return value < min
      ? min
      : value > currentSecond
      ? currentSecond
      : value <= currentSecond
      ? applyStepOnValue(value, data)
      : min;
  }

  function adjustCurrentSecond(value: number): number {
    return value < currentFirst
      ? currentFirst
      : value > max
      ? max
      : value <= max
      ? applyStepOnValue(value, data)
      : currentFirst;
  }

  function adjustAsIs(value: IModelData): IModelData {
    return value;
  }

  return value;
}
