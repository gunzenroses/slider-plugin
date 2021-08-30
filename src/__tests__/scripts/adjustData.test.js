import { sliderData } from "mvp/data";
import adjustValue from "helpers/adjustData";

const data = sliderData;

describe("adjustData", () => {
  test("should adjust and update negative 'step', 'min' and 'max' data in model", () => {
    const step = adjustValue("step", -2, data);
    const min = adjustValue("min", -2, data);
    const max = adjustValue("max", -130, data);

    expect(step).toBe(1);
    expect(min).toBe(0);
    expect(max).toBe(1);
  });

  test("should adjust and update 'min' when it's > than (max - step)", () => {
    const min = adjustValue("min", 103, data);

    expect(min).toBe(1);
  });

  test("should adjust and update 'step' > (max - min)", () => {
    const step = adjustValue("step", 108, data);

    expect(step).toBe(100);
  });

  test("should not change 'currentFirst' and 'currentSecond' if they are > 0", () => {
    const currentFirst = adjustValue("currentFirst", 11, data);
    const currentSecond = adjustValue("currentSecond", 35, data);

    expect(currentFirst).toBe(11);
    expect(currentSecond).toBe(35);
  });

  test("should adjust and update negative 'currentFirst' and 'currentSecond' data in model", () => {
    const currentFirst = adjustValue("currentFirst", -11, data);
    const currentSecond = adjustValue("currentSecond", -35, data);

    expect(currentFirst).toBe(0);
    expect(currentSecond).toBe(33);
  });

  test("should adjust and update 'currentFirst' > 'currentSecond'", () => {
    const currentFirst = adjustValue("currentFirst", 77, data);
    const currentSecond = adjustValue("currentSecond", 50, data);

    expect(currentFirst).toBe(65);
    expect(currentSecond).toBe(50);
  });
});
