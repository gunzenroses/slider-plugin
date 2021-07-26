import { TSettings } from "../types/types";
import { applyStepOnValue } from "./common";

function adjustValue(name: string, value: number|string|boolean, data: TSettings){
    let info: TSettings = data;
    let max = info.max;
    let min = info.min;
    let step = info.step;
    let currentFirst = info.currentFirst;
    let currentSecond = info.currentSecond;

    switch (name) {
        case "step": value = adjustStep(value as number); break;
        case "min": value = adjustMin(value as number); break;
        case "max": value = adjustMax(value as number); break;
        case "currentFirst": value = adjustCurrentFirst(value as number); break;
        case "currentSecond": value = adjustCurrentSecond(value as number); break;
        default: value = adjustAsIs(value as string|boolean); break;
    }

    return value;

    function adjustMin(value: number){
        return (value <= (max - step))
            ? value
            : (max - step);
    }

    function adjustMax(value: number){
        return (value >= (min + step))
            ? value
            : (min + step);
    }

    function adjustStep(value: number){
        return (value <= 0)
                ? 1
                : ((value > (max - min))
                    ? (max - min)
                    : (value < (max - min)
                        ? value
                        : 1))
    }

    function adjustCurrentFirst(value: number){
        return (value < min)
            ? min
            : ((value > currentSecond)
                ? currentSecond
                : ( (value >= min && value <= currentSecond)
                    ? applyStepOnValue(value, max, min, step)
                    : min ))
    }

    function adjustCurrentSecond(value: number){
        return (value < currentFirst)
            ? currentFirst
            : ((value > max)
                ? max
                : ((value >= currentFirst && value <= max)
                    ? applyStepOnValue(value, max, min, step)
                    : currentFirst ))
    }

    function adjustAsIs(value: string | boolean){
        return value;
    }
}

export { adjustValue }