function applyStep(value: number, max: number, step: number): number {
    let stepInPercents: number = parseFloat((100/max * step).toFixed(2));
    let numberOfSteps = value / stepInPercents;
    let realNumberOfSteps = (value % stepInPercents > stepInPercents/2)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === 100)
                    ? value
                    : realNumberOfSteps * stepInPercents;
    return realValue;
}

function fromPercentsToValue(value: number, max: number, min: number){
    let newValue = Math.round(value * (max - min) / 100).toString();
    return newValue;
}
export { applyStep, fromPercentsToValue }