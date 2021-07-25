import { applyStepOnValue } from "./common";

function adjustMin(value: number, max: number, step: number){
    return (value <= (max - step))
        ? value
        : (max - step);
}

function adjustMax(value: number, min: number, step: number){
    return (value >= (min + step))
        ? value
        : (min + step);
}

function adjustStep(step: number, max: number, min: number){
    return (step <= 0)
            ? 1
            : ((step > (max - min))
                ? (max - min)
                : (step < (max - min)
                    ? step
                    : 1))
}

function adjustCurrentFirst(value: number, currentSecond: number, max: number, min: number, step: number){
    return (value < min)
        ? min
        : ((value > currentSecond)
            ? currentSecond
            : ( (value >= min && value <= currentSecond)
                ? applyStepOnValue(value, max, min, step)
                : min ))
}

function adjustCurrentSecond(value: number, currentFirst: number, max: number, min: number, step: number){
    return (value < currentFirst)
        ? currentFirst
        : ((value > max)
            ? max
            : ((value >= currentFirst && value <= max)
                ? applyStepOnValue(value, max, min, step)
                : currentFirst ))
}


export { adjustMin, adjustMax, adjustStep, adjustCurrentFirst, adjustCurrentSecond }