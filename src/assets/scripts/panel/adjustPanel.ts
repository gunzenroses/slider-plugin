import { applyStepOnValue } from "../common";

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
    return (step < 0)
        ? 1
        : ((step > (max - min))
            ? (max - min)
            : step)
}

function adjustCurrentFirst(value: number, currentSecond: number, max: number, min: number, step: number){
    if (value < min) return min;
    if (value > currentSecond) return currentSecond;
    if (value >= min && value <= currentSecond){
        return applyStepOnValue(value, max, min, step);
    }
}

function adjustCurrentSecond(value: number, currentFirst: number, max: number, min: number, step: number){
    if (value < currentFirst) return currentFirst;
    if (value > max) return max;
    if (value >= currentFirst && value <= max){
        return applyStepOnValue(value, max, min, step);
    }
}


export { adjustMin, adjustMax, adjustStep, adjustCurrentFirst, adjustCurrentSecond }