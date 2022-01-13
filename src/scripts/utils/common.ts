import { TSettings } from './types';

function appendCustomElement(type: string, className: string, parent: HTMLElement): HTMLElement {
  const el = document.createElement(`${type}`);
  el.classList.add(className);
  parent.append(el);
  return el;
}

function afterCustomElement(type: string, className: string, parent: HTMLElement): HTMLElement {
  const el = document.createElement(`${type}`);
  el.classList.add(className);
  parent.after(el);
  return el;
}

//checked
function applyRestrictions(value: number): number {
  const newValue = value > 100 ? 100 : value < 0 ? 0 : value;
  return newValue;
}

//all in %
function applyStepOnPercents(value: number, step: number): number {
  const numberOfSteps = (value * 100) / (step * 100);
  const realNumberOfSteps =
    value % step >= step / 2 ? Math.ceil(numberOfSteps) : Math.floor(numberOfSteps);
  const realValue = value === 100 ? value : parseFloat((realNumberOfSteps * step).toFixed(2));
  return realValue;
}

//checked: all values are actual
function applyStepOnValue(value: number, data: TSettings): number {
  const { max, min, step } = data;
  if (value - min <= 0) return min;
  if (value >= max) return max;
  const decimalValue = getNumbersAfterDot(value);
  const magnifyValue = decimalValue === 0 ? 1 : 10 ** getNumbersAfterDot(value);
  const decimalMin = getNumbersAfterDot(min);
  const magnifyMin = decimalMin === 0 ? 1 : 10 ** getNumbersAfterDot(min);
  const decimalStep = getNumbersAfterDot(step);
  const magnifyStep = decimalStep === 0 ? 1 : 10 ** getNumbersAfterDot(step);
  const magnify = Math.max(magnifyMin, magnifyStep, magnifyValue);
  const numberOfSteps = Math.round(((value - min) * magnify) / (step * magnify));
  const decimalForSteps = Math.max(decimalStep, decimalMin);
  const valueInSteps = parseFloat(
    ((numberOfSteps * step * magnify + min * magnify) / magnify).toFixed(decimalForSteps)
  );
  const realValue = valueInSteps >= max ? max : valueInSteps;
  return realValue;
}

//done: initial values are actual, return %
function changeValueToPercents(value: number, data: TSettings): number {
  const { max, min } = data;
  const newValue = parseFloat((((value - min) / (max - min)) * 100).toFixed(2));
  return newValue;
}

//done: initial values are actual, return %
function changeStepToPercents(data: TSettings): number {
  const { max, min, step } = data;
  const newValue = (step / (max - min)) * 100;
  const stepInPerc = max > 500000 ? newValue : parseFloat(newValue.toFixed(2));
  return stepInPerc;
}

function fromValueToPX(value: number, data: TSettings, containerSize: number): number {
  const { max, min } = data;
  const pxPerDivis = containerSize / (max - min);
  const valueInPx = value * pxPerDivis;
  return valueInPx;
}

function findPosition(
  thisElement: HTMLElement,
  ifHorizontal: boolean,
  containerSize: number
): number {
  const newPosition = ifHorizontal
    ? thisElement.style.left
      ? parseInt(thisElement.style.left.replace('%', ''))
      : (parseInt(getComputedStyle(thisElement).left.replace('px', '')) / containerSize) * 100
    : thisElement.style.bottom
    ? parseInt(thisElement.style.bottom.replace('%', ''))
    : (parseInt(getComputedStyle(thisElement).bottom.replace('px', '')) / containerSize) * 100;
  return newPosition;
}

// checked: value in %, others are actual
function changePercentsToValue(valueInPercents: number, data: TSettings): number {
  const { max, min } = data;
  const newValue = Math.round((valueInPercents * (max - min)) / 100) + min;
  return newValue;
}

function getNumbersAfterDot(value: number): number {
  const hasTail = value.toString().includes('.');
  const tail = value.toString().split('.').pop();
  if (hasTail && tail != null) {
    return tail.length;
  } else {
    return 0;
  }
}

function getTextWidth(text: string, font: string): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width + 6;
  } else {
    return 40;
  }
}

//values are actual
function valueToPercentsApplyStep(value: number, data: TSettings): number {
  const valuePerc = changeValueToPercents(value, data);
  const stepPerc = changeStepToPercents(data);
  const newValue = applyStepOnPercents(valuePerc, stepPerc);
  return newValue;
}

export {
  afterCustomElement,
  appendCustomElement,
  applyRestrictions,
  applyStepOnPercents,
  applyStepOnValue,
  getNumbersAfterDot,
  getTextWidth,
  findPosition,
  fromValueToPX,
  changeValueToPercents,
  changePercentsToValue,
  valueToPercentsApplyStep,
};
