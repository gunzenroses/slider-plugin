function applyStep(value: number, max: number, step: number): number {
    let stepInPercents: number = parseFloat((100/max * step).toFixed(2));
    let numberOfSteps = value / stepInPercents;
    let realNumberOfSteps = (value % stepInPercents > 5)
                ? Math.ceil(numberOfSteps)
                : Math.floor(numberOfSteps);
    let realValue = (value === 100)
                    ? value
                    : realNumberOfSteps * stepInPercents;
    return realValue;
}

export { applyStep }