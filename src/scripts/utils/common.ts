function appendCustomElement(options: {
  type: string,
  className: string,
  parent: HTMLElement
}): HTMLElement {
  const { type, className, parent } = options;
  const el = document.createElement(type);
  el.classList.add(className);
  parent.append(el);
  return el;
}

function afterCustomElement(options: {
  type: string,
  className: string,
  parent: HTMLElement
}): HTMLElement {
  const { type, className, parent } = options;
  const el = document.createElement(type);
  el.classList.add(className);
  parent.after(el);
  return el;
}

function getNumbersAfterDot(value: number): number {
  const hasTail = value.toString().includes('.');
  const tail = value.toString().split('.').pop();
  if (hasTail && tail != null) {
    return tail.length;
  }
  return 0;
}

function applyRestrictions(value: number): number {
  if (value > 100) {
    return 100;
  } if (value < 0) {
    return 0;
  }
  return value;
}

function applyStepOnPercents(value: number, step: number): number {
  const numberOfSteps = (value * 100) / (step * 100);
  const realNumberOfSteps = value % step >= step / 2
    ? Math.ceil(numberOfSteps)
    : Math.floor(numberOfSteps);
  const realValue = value === 100
    ? value
    : parseFloat((realNumberOfSteps * step).toFixed(2));
  return realValue;
}

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
  const numberOfSteps = Math.round(
    ((value - min) * magnify) / (step * magnify)
  );
  const decimalForSteps = Math.max(decimalStep, decimalMin);
  const valueInSteps = parseFloat(
    ((numberOfSteps * step * magnify + min * magnify) / magnify).toFixed(
      decimalForSteps
    )
  );
  const realValue = valueInSteps >= max ? max : valueInSteps;
  return realValue;
}

function changeValueToPercents(value: number, data: TSettings): number {
  const { max, min } = data;
  const diff = max - min;
  if (diff === 0) {
    return 100;
  }
  const newValue = parseFloat(
    (((value - min) / (diff)) * 100).toFixed(2)
  );
  return newValue;
}

function fromValueToPX(options: {
  value: number,
  data: TSettings,
  containerSize: number
}): number {
  const { value, data, containerSize } = options;
  const { max, min } = data;
  const diff = max - min;
  if (diff === 0) {
    return containerSize;
  }
  const pxPerDivis = containerSize / (max - min);
  const valueInPx = value * pxPerDivis;
  return valueInPx;
}

function findPosition(options: {
  thisElement: HTMLElement,
  ifHorizontal: boolean,
  containerSize: number
}): number {
  const { thisElement, ifHorizontal, containerSize } = options;
  let newPos;
  if (containerSize === 0) {
    newPos = 0;
  } else if (ifHorizontal) {
    newPos = thisElement.style.left
      ? parseInt(thisElement.style.left.replace('%', ''), 10)
      : (parseInt(getComputedStyle(thisElement).left.replace('px', ''), 10)
            / containerSize)
          * 100;
  } else {
    newPos = thisElement.style.bottom
      ? parseInt(thisElement.style.bottom.replace('%', ''), 10)
      : (parseInt(getComputedStyle(thisElement).bottom.replace('px', ''), 10)
            / containerSize)
          * 100;
  }
  return newPos;
}

function changePercentsToValue(
  valueInPercents: number,
  data: TSettings
): number {
  const { max, min } = data;
  const newValue = valueInPercents === 100
    ? max
    : Math.round((valueInPercents * (max - min)) / 100) + min;
  return newValue;
}

function getTextWidth(text: string, font: string): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width + 6;
  }
  return 40;
}

function valueToPercentsApplyStep(value: number, data: TSettings): number {
  if (value >= data.max) {
    return 100;
  }
  const total = data.max - data.min;
  const currentValue = value - data.min;
  const currentInSteps = Math.ceil(currentValue / data.step);
  const currentActual = currentInSteps * data.step;
  let newValue;
  if (total === 0) {
    newValue = 100;
  } else {
    newValue = (currentActual / total) * 100;
  }
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
  valueToPercentsApplyStep
};
