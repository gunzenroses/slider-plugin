declare function adjustMin(value: number, max: number, step: number): number;
declare function adjustMax(value: number, min: number, step: number): number;
declare function adjustStep(step: number, max: number, min: number): number;
declare function adjustCurrentFirst(value: number, currentSecond: number, max: number, min: number, step: number): number | undefined;
declare function adjustCurrentSecond(value: number, currentFirst: number, max: number, min: number, step: number): number | undefined;
export { adjustMin, adjustMax, adjustStep, adjustCurrentFirst, adjustCurrentSecond };
