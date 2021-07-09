import { applyStepOnValue } from "../common";

function validateMin(value: number, max: number, step: number){
    return (value <= (max - step))
        ? value
        : (max - step);
}

function validateMax(value: number, min: number, step: number){
    return (value >= (min + step))
        ? value
        : (min + step);
}

function validateStep(step: number, max: number, min: number){
    return (step < 0)
        ? 1
        : ((step > (max - min))
            ? (max - min)
            : step)
}

function validateCurrentFirst(value: number, currentSecond: number, max: number, min: number, step: number){
    if (value < min) return min;
    if (value > currentSecond) return currentSecond;
    if (value >= min && value <= currentSecond){
        return applyStepOnValue(value, max, min, step);
    }
}

function validateCurrentSecond(value: number, currentFirst: number, max: number, min: number, step: number){
    if (value < currentFirst) return currentFirst;
    if (value > max) return max;
    if (value >= currentFirst && value <= max){
        return applyStepOnValue(value, max, min, step);
    }
}


export { validateMin, validateMax, validateStep, validateCurrentFirst, validateCurrentSecond }