function applyStep(value: number, max: number, step: number): number {
    let stepInPercents: number = parseFloat((100/max * step).toFixed(2));
    let numberOfSteps = Math.round(value / stepInPercents);
    let newValue = (value === 100)
                    ? value
                    : numberOfSteps * stepInPercents;
    return newValue;
}

export { applyStep }