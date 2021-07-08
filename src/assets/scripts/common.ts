import { TSettings } from "./types/types";

//all in %
function applyStepOnPercents(value: number, step: number): number {
    let numberOfSteps = value / step;
    let realNumberOfSteps = (value % step > step/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === 100)
                    ? value
                    : parseFloat((realNumberOfSteps * step).toFixed(2));
    return realValue;
}

//checked: all values are actual
function applyStepOnValue(value: number, max: number, min: number, step: number): number {
    let numberOfSteps = (value - min) / step;
    let realNumberOfSteps = ((value - min) % step >= step/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === max)
                    ? value
                    : (realNumberOfSteps * step) + min;
    return realValue;
}

//checked
function applyRestrictions(value: number){
    let newValue = value > 100
                    ? 100
                    : value < 0
                        ? 0
                        : value;
    return newValue;
}

// checked: value in %, others are actual
function fromPercentsToValue(valueInPercents: number, max: number, min: number){
    let newValue = (Math.round(valueInPercents * (max - min) / 100) + min).toString();
    return newValue;
}

//done: initial values are actual, return %
function fromValueToPercents(value: number, max: number, min: number){
    let newValue = (value - min) / (max - min) * 100;
    return newValue;
}

//done: initial values are actual, return %
function stepToPercents(step: number, max: number, min: number){
    let newValue = parseFloat(( step / (max - min) * 100).toFixed(2));
    return newValue;
}

function fromValueToPX(value: number, max: number, min: number, containerSize: number){
    let pxPerDivis = containerSize / (max - min);
    let valueInPx = value*pxPerDivis;
    return valueInPx;
}

function findPosition(thisElement: HTMLElement, ifHorizontal: boolean, containerSize: number){
    let newPosition = ifHorizontal
            ? (thisElement.style.left)
                ? parseInt(thisElement.style.left.replace("%",""))
                : parseInt(getComputedStyle(thisElement).left.replace("px",""))/containerSize*100
            : (thisElement.style.bottom)
                ? parseInt(thisElement.style.bottom.replace("%",""))
                : parseInt(getComputedStyle(thisElement).bottom.replace("px",""))/containerSize*100;
    return newPosition;
}

function mergeData(sliderData: TSettings, options: TSettings){
    var c: TSettings = {};
    let key: string;
    for (key in sliderData){
        if (sliderData.hasOwnProperty(key)){
            c[key] = key in options ? options[key] : sliderData[key]
        }
    };
    return c;
}

//value %, max, min, step are actual values
function fromPercentsToValueApplyStep(value: number, max: number, min: number, step: number){
    let value2 = parseInt(fromPercentsToValue(value, max, min));
    let newValue = applyStepOnValue(value2, max, min, step);
    return newValue;
}

//values are actual 
function fromValueToPercentsApplyStep(value: number, max: number, min: number, step: number){
    let valuePerc = fromValueToPercents(value, max, min);
    let stepPerc = stepToPercents(step, max, min);
    let newValue = applyStepOnPercents(valuePerc, stepPerc);
    return newValue;
}

export { applyStepOnValue, applyRestrictions, fromPercentsToValue, fromValueToPX, findPosition, mergeData, fromPercentsToValueApplyStep, fromValueToPercentsApplyStep }