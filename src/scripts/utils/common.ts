//all in %
function applyStepOnPercents(value: number, step: number): number {
  const numberOfSteps = (value * 100) / (step * 100);
  const realNumberOfSteps =
    value % step >= step / 2 ? Math.ceil(numberOfSteps) : Math.floor(numberOfSteps);
  const realValue = value === 100 ? value : parseFloat((realNumberOfSteps * step).toFixed(2));
  return realValue;
}

//checked: all values are actual
function applyStepOnValue(value: number, max: number, min: number, step: number): number {
  if (value - min <= 0) return min;
  const numberOfSteps = ((value - min) * 100) / (step * 100);
  const realNumberOfSteps =
    (value - min) % step > step / 2 ? Math.ceil(numberOfSteps) : Math.floor(numberOfSteps);
  const valueInSteps = realNumberOfSteps * step + min;
  const realValue = value === max ? value : valueInSteps > max ? max : valueInSteps;
  return realValue;
}

//checked
function applyRestrictions(value: number): number {
  const newValue = value > 100 ? 100 : value < 0 ? 0 : value;
  return newValue;
}

// checked: value in %, others are actual
function fromPercentsToValue(valueInPercents: number, max: number, min: number): string {
  const newValue = (Math.round((valueInPercents * (max - min)) / 100) + min).toString();
  return newValue;
}

//done: initial values are actual, return %
function changeValueToPercents(value: number, max: number, min: number): number {
  const newValue = parseFloat((((value - min) / (max - min)) * 100).toFixed(2));
  return newValue;
}

//done: initial values are actual, return %
function changeStepToPercents(step: number, max: number, min: number): number {
  const newValue = parseFloat(((step / (max - min)) * 100).toFixed(2));
  return newValue;
}

function fromValueToPX(value: number, max: number, min: number, containerSize: number): number {
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
      ? parseInt(thisElement.style.left.replace("%", ""))
      : (parseInt(getComputedStyle(thisElement).left.replace("px", "")) / containerSize) * 100
    : thisElement.style.bottom
    ? parseInt(thisElement.style.bottom.replace("%", ""))
    : (parseInt(getComputedStyle(thisElement).bottom.replace("px", "")) / containerSize) * 100;
  return newPosition;
}

//value %, max, min, step are actual values
function percentsToValueApplyStep(value: number, max: number, min: number, step: number): number {
  const value2 = parseInt(fromPercentsToValue(value, max, min));
  const newValue = applyStepOnValue(value2, max, min, step);
  return newValue;
}

//values are actual
function valueToPercentsApplyStep(value: number, max: number, min: number, step: number): number {
  const valuePerc = changeValueToPercents(value, max, min);
  const stepPerc = changeStepToPercents(step, max, min);
  const newValue = applyStepOnPercents(valuePerc, stepPerc);
  return newValue;
}

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

function commonDivider(basicNum: number, changeNum: number): number {
  const bigger = basicNum;
  //let smaller = changeNum;
  let smaller = changeNum > 1 ? changeNum : 1;
  if (bigger <= smaller) {
    return smaller;
  } else {
    while (bigger % smaller !== 0) {
      smaller++;
    }
    return smaller;
  }
}

export {
  applyStepOnValue,
  applyRestrictions,
  fromPercentsToValue,
  changeValueToPercents,
  commonDivider,
  fromValueToPX,
  findPosition,
  percentsToValueApplyStep,
  valueToPercentsApplyStep,
  appendCustomElement,
  afterCustomElement,
};
