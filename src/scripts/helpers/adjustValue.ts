import { TModelData, TSettings } from 'utils/types';
import { applyStepOnValue, getNumbersAfterDot } from 'utils/common';

function adjustValue(name: string, value: TModelData, data: TSettings): TModelData {
  const { max, min, step, currentFirst, currentSecond }: TSettings = data;
  if (typeof value === 'string' || typeof value === 'number') {
    switch (name) {
      case 'step':
        value = adjustStep(value);
        break;
      case 'min':
        value = adjustMin(value);
        break;
      case 'max':
        value = adjustMax(value);
        break;
      case 'currentFirst':
        value = adjustCurrentFirst(value);
        break;
      case 'currentSecond':
        value = adjustCurrentSecond(value);
        break;
      default:
        value = adjustAsIs(value);
        break;
    }
  } else {
    value = adjustAsIs(value);
  }

  function adjustMin(value: number | string): number {
    const minDiff = max - step;
    if (typeof value === 'string') {
      return minDiff;
    } else {
      return value <= minDiff ? value : max - step;
    }
  }

  function adjustMax(value: number | string): number {
    const decimalMin = getNumbersAfterDot(min);
    const decimalStep = getNumbersAfterDot(step);
    const decimalCommon = Math.max(decimalMin, decimalStep);
    const decimalMultiply = 10 ** decimalCommon;
    const lowestMax = (min * decimalMultiply + step * decimalMultiply) / decimalMultiply;
    if (typeof value === 'string') {
      return lowestMax;
    } else {
      return value >= lowestMax ? value : lowestMax;
    }
  }

  function adjustStep(value: number | string): number {
    if (typeof value === 'string') {
      return 1;
    } else {
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
  }

  function adjustCurrentFirst(value: number | string): number {
    if (typeof value === 'string') {
      return min;
    } else {
      return value <= min
        ? min
        : value > currentSecond
        ? currentSecond
        : value <= currentSecond
        ? applyStepOnValue(value, data)
        : min;
    }
  }

  function adjustCurrentSecond(value: number | string): number {
    if (typeof value === 'string') {
      return max;
    } else {
      return value < currentFirst
        ? currentFirst
        : value > max
        ? max
        : value <= max
        ? applyStepOnValue(value, data)
        : max;
    }
  }

  function adjustAsIs(value: TModelData): TModelData {
    return value;
  }

  return value;
}

export default adjustValue;
