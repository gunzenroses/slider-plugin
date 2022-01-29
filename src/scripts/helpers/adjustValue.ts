import { TModelData, TSettings } from 'utils/types';
import { applyStepOnValue, getNumbersAfterDot } from 'utils/common';

function adjustValue(
  name: string,
  value: TModelData,
  data: TSettings
): TModelData {
  const {
    max,
    min,
    step,
    currentFirst,
    currentSecond
  }: TSettings = data;

  function adjustMin(val: number | string): number {
    const minDiff = max - 1;
    if (typeof val === 'string') {
      return minDiff;
    } else {
      return val <= minDiff ? val : minDiff;
    }
  }

  function adjustMax(val: number | string): number {
    const minDiff = min + 1;
    if (typeof val === 'string') {
      return minDiff;
    }
    return val >= minDiff ? val : minDiff;
  }

  function adjustStep(val: number | string): number {
    if (typeof val === "number" && val >= 1) {
      return val
    } else {
      return 1;
    }
  }

  function adjustCurrentFirst(val: number | string): number {
    const between = value > currentFirst && value < currentSecond;
    const inOneStep = currentSecond - currentFirst === step;
    if (typeof val === 'string') {
      return min;
    } else if (val <= min) {
      return min;
    } else if (val > currentSecond) {
      return currentSecond;
    } else if (between && inOneStep) {
      if (value > currentFirst + step / 4) {
        return currentSecond;
      } else {
        return currentFirst;
      }
    } else if (value <= currentSecond) {
      return applyStepOnValue(val, data);
    } else {
      return min;
    }
  }

  function adjustCurrentSecond(val: number | string): number {
    const between = value > currentFirst && value < currentSecond;
    const inOneStep = currentSecond - currentFirst === step;
    if (typeof val === 'string') {
      return max;
    } else if (val < currentFirst) {
      return currentFirst;
    } else if (val > max) {
      return max;
    } else if (between && inOneStep) {
      if (value > currentFirst + 0.75 * step) {
        return currentSecond;
      } else {
        return currentFirst;
      }
    } else if (val <= max) {
      return applyStepOnValue(val, data);
    } else {
      return max;
    }
  }

  function adjustAsIs(val: TModelData): TModelData {
    return val;
  }

  let newValue;
  if (typeof value === 'string' || typeof value === 'number') {
    switch (name) {
      case 'step':
        newValue = adjustStep(value);
        break;
      case 'min':
        newValue = adjustMin(value);
        break;
      case 'max':
        newValue = adjustMax(value);
        break;
      case 'currentFirst':
        newValue = adjustCurrentFirst(value);
        break;
      case 'currentSecond':
        newValue = adjustCurrentSecond(value);
        break;
      default:
        newValue = adjustAsIs(value);
        break;
    }
  } else {
    newValue = adjustAsIs(value);
  }
  return newValue;
}

export default adjustValue;
