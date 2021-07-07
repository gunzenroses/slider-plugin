import { TSettings } from "./types/types";

//values %, step as value!!!!!!!!!!!!!
function applyStepOnPercents(value: number, max: number, min: number, step: number): number {
    let stepInPercents: number  = Math.trunc((step/(max - min))*100) / 100;
    let numberOfSteps = value / stepInPercents;
    let realNumberOfSteps = (value % stepInPercents > stepInPercents/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === 100)
                    ? value
                    : parseFloat((realNumberOfSteps * stepInPercents).toFixed(2));
    return realValue;
}

//kinda checked
function applyStepOnValue(value: number, max: number, min: number, step: number): number {
    let numberOfSteps = value / step;
    let realNumberOfSteps = (value % step >= step/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === max)
                    ? value
                    : (realNumberOfSteps * step) + min;
    return realValue;
}

function applyRestrictions(value: number){
    let newValue = value > 100
                    ? 100
                    : value < 0
                        ? 0
                        : value;
    return newValue;
}

// value in %, others are actual ???????
function fromPercentsToValue(valueInPercents: number, max: number, min: number){
    let newValue = (Math.round(valueInPercents * (max - min) / 100) + min).toString();
    return newValue;
}

//done: initial values are actual
function fromValueToPercents(value: number, max: number, min: number){
    let newValue = (value - min) / (max - min) * 100;
    return newValue;
}

//done: initial values are actual
function stepToPercents(step: number, max: number, min: number){
    let newValue = parseFloat(( step / (max - min) * 100).toFixed(2));
    return newValue;
}

//done: all values should be in %
function valueInPercentsWithStep(value: number, step: number): number {
    let numberOfSteps = value / step;
    let realNumberOfSteps = (value % step > step/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === 100)
                    ? value
                    : parseFloat((realNumberOfSteps * step).toFixed(2));
    return realValue;
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

//kinda checked
function fromPercentstoValueApplyStep(value: number, max: number, min: number, step: number){
    let value2 = parseInt(fromPercentsToValue(value, max, min));
    let newValue = applyStepOnValue(value2, max, min, step);
    return newValue;
}

//values are actual 
function fromValueToPercentsApplyStep(value: number, max: number, min: number, step: number){
    let percents = fromValueToPercents(value, max, min);
    //first one in %, all others are values
    let newValue = applyStepOnPercents(percents, max, min, step);
    return newValue;
}

export { applyStepOnPercents, applyStepOnValue, applyRestrictions, fromPercentsToValue, fromValueToPercents, fromValueToPX, findPosition, mergeData, fromPercentstoValueApplyStep, fromValueToPercentsApplyStep, stepToPercents, valueInPercentsWithStep }