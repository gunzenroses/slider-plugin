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
    const minDiff = max - step;
    if (typeof val === 'string') {
      return minDiff;
    }
    return val <= minDiff ? val : max - step;
  }

  function adjustMax(val: number | string): number {
    const decimalMin = getNumbersAfterDot(min);
    const decimalStep = getNumbersAfterDot(step);
    const decimalCommon = Math.max(decimalMin, decimalStep);
    const decimalMultiply = 10 ** decimalCommon;
    const lowestMax = (min * decimalMultiply + step * decimalMultiply)
      / decimalMultiply;
    if (typeof val === 'string') {
      return lowestMax;
    }
    return val >= lowestMax ? val : lowestMax;
  }

  function adjustStep(val: number | string): number {
    if (typeof val === 'string') {
      return 1;
    } if (val <= 1) {
      return 1;
    } if (val > max - min) {
      return max - min;
    } if (val < max - min) {
      return val;
    } if (val === max - min) {
      return max - min;
    }
    return 1;
  }

  function adjustCurrentFirst(val: number | string): number {
    if (typeof val === 'string') {
      return min;
    } if (val <= min) {
      return min;
    } if (val > currentSecond) {
      return currentSecond;
    } if (val <= currentSecond) {
      return applyStepOnValue(val, data);
    }
    return min;
  }

  function adjustCurrentSecond(val: number | string): number {
    if (typeof val === 'string') {
      return max;
    } if (val < currentFirst) {
      return currentFirst;
    } if (val > max) {
      return max;
    } if (val <= max) {
      return applyStepOnValue(val, data);
    }
    return max;
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
