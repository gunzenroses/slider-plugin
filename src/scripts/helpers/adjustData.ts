import { TSettings } from "utils/types";
import { applyStepOnValue } from "utils/common";
import { sliderData } from "mvp/data";

export default function adjustValue(
  name: string,
  value: number | string | boolean,
  data: TSettings
): number | string | boolean {
  const { max, min, step, currentFirst, currentSecond }: TSettings = sliderData;

  switch (name) {
    case "step":
      value = adjustStep(value as number);
      break;
    case "min":
      value = adjustMin(value as number);
      break;
    case "max":
      value = adjustMax(value as number);
      break;
    case "currentFirst":
      value = adjustCurrentFirst(value as number);
      break;
    case "currentSecond":
      value = adjustCurrentSecond(value as number);
      break;
    default:
      value = adjustAsIs(value as string | boolean);
      break;
  }

  function adjustMin(value: number) {
    return value < 0 ? 0 : value <= max - step ? value : 1;
  }

  function adjustMax(value: number) {
    return value < 0 ? min + step : value >= min + step ? value : min + step;
  }

  function adjustStep(value: number) {
    return value <= 0 ? 1 : value > max - min ? max - min : value;
  }

  function adjustCurrentFirst(value: number) {
    return value < min
      ? min
      : value > currentSecond
      ? currentSecond
      : value >= min && value <= currentSecond
      ? applyStepOnValue(value, max, min, step)
      : min;
  }

  function adjustCurrentSecond(value: number) {
    return value < currentFirst
      ? currentFirst
      : value > max
      ? max
      : value >= currentFirst && value <= max
      ? applyStepOnValue(value, max, min, step)
      : currentFirst;
  }

  function adjustAsIs(value: string | boolean) {
    return value;
  }

  return value;
}
