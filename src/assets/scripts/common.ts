import { TSettings } from "./types/types";

function applyStepOnPercents(value: number, max: number, min: number, step: number): number {
    let stepInPercents: number  = Math.trunc((100/(max - min) * step)*100) / 100;
    let numberOfSteps = value / stepInPercents;
    let realNumberOfSteps = (value % stepInPercents > stepInPercents/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === 100)
                    ? value
                    : parseFloat((realNumberOfSteps * stepInPercents).toFixed(2));
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

function fromPercentsToValue(value: number, max: number, min: number){
    let newValue = (Math.round(value * (max - min) / 100) + min).toString();
    return newValue;
}

function fromValueToPercents(value: number, max: number, min: number){
    let newValue = (value / (max - min) * 100);
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

function fromPercentstoValueApplyStep(value: number, max: number, min: number, step: number){
    let stepValue = applyStepOnPercents(value, max, min, step);
    let newValue = parseInt(fromPercentsToValue(stepValue, max, min));
    return newValue;
}

function fromValueToPercentsApplyStep(value: number, max: number, min: number, step: number){
    let percents = fromValueToPercents(value, max, min);
    let newValue = applyStepOnPercents(percents, max, min, step);
    return newValue;
}

export { applyStepOnPercents, applyRestrictions, fromPercentsToValue, fromValueToPercents, fromValueToPX, findPosition, mergeData, fromPercentstoValueApplyStep, fromValueToPercentsApplyStep }