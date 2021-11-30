import { TModelData, TSettings } from "Utils/types";
import { applyStepOnValue } from "Utils/common";

export default function adjustValue(name: string, value: TModelData, data: TSettings): TModelData {
  const { max, min, step, currentFirst, currentSecond }: TSettings = data;
  if (typeof value === "number") {
    switch (name) {
    case "step":
      value = adjustStep(value);
      break;
    case "min":
      value = adjustMin(value);
      break;
    case "max":
      value = adjustMax(value);
      break;
    case "currentFirst":
      value = adjustCurrentFirst(value);
      break;
    case "currentSecond":
      value = adjustCurrentSecond(value);
      break;
    default:
      value = adjustAsIs(value);
      break;
    }
  } else {
    value = adjustAsIs(value);
  }
  

  function adjustMin(value: number): number {
    return value <= max - step ? value : 0;
  }

  function adjustMax(value: number): number {
    return value >= min + step ? value : min + step;
  }

  function adjustStep(value: number): number {
    return value <= 1
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

  function adjustAsIs(value: TModelData): TModelData {
    return value;
  }

  return value;
}
