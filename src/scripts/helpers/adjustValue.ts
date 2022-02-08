import { applyStepOnValue } from 'utils/common';

function adjustValue(options: {
  name: string,
  value: TModelData,
  data: TSettings,
}): TModelData {
  const { name, value, data } = options;
  const {
    max, min, step, currentFirst, currentSecond
  }: TSettings = data;

  function adjustMin(val: number | string): number {
    const minDiff = max - 1;
    if (typeof val === 'string') {
      return minDiff;
    }
    return val <= minDiff ? val : minDiff;
  }

  function adjustMax(val: number | string): number {
    const minDiff = min + 1;
    if (typeof val === 'string') {
      return minDiff;
    }
    return val >= minDiff ? val : minDiff;
  }

  function adjustStep(val: number | string): number {
    if (typeof val === 'number' && val >= 1) {
      return val;
    }
    return 1;
  }

  function adjustCurrentFirst(val: number | string): number {
    const between = value > currentFirst && value < currentSecond;
    const inOneStep = currentSecond - currentFirst === step;
    const betweenInOneStep = between && inOneStep;
    const moreThanHalfWay = value > currentFirst + step / 2;
    if (typeof val === 'string') {
      return min;
    }
    if (val <= min) {
      return min;
    }
    if (val > currentSecond) {
      return currentSecond;
    }
    if (betweenInOneStep && moreThanHalfWay) {
      return currentSecond;
    }
    if (value <= currentSecond) {
      return applyStepOnValue(val, data);
    }
    return min;
  }

  function adjustCurrentSecond(val: number | string): number {
    const between = value > currentFirst && value < currentSecond;
    const inOneStep = currentSecond - currentFirst === step;
    const betweenInOneStep = between && inOneStep;
    const moreThanHalfWay = value > currentFirst + 0.5 * step;
    if (typeof val === 'string') {
      return max;
    }
    if (val < currentFirst) {
      return currentFirst;
    }
    if (val > max) {
      return max;
    }
    if (betweenInOneStep && moreThanHalfWay) {
      return currentSecond;
    }
    if (val <= max) {
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
