import { sliderData } from "mvp/data";
import adjustValue from "helpers/adjustValue";
import { applyStepOnValue } from "utils/common";

const data = sliderData;

describe("adjustValue", () => {
  describe("should adjust 'min'", () => {
    test("< 0", () => {
      const min = adjustValue("min", -2, data);

      expect(min).toBe(0);
    });

    test("< 'max' - 'step'", () => {
      const temp = data.max - data.step - 1;
      const min = adjustValue("min", temp, data);

      expect(min).toBe(temp);
    });

    test("=== 'max' - 'step'", () => {
      const temp = data.max - data.step;
      const min = adjustValue("min", temp, data);

      expect(min).toBe(temp);
    });

    test("> 'max' - 'step'", () => {
      const temp = data.max - data.step + 1;
      const min = adjustValue("min", temp, data);

      expect(min).toBe(1);
    });

    test("=== NaN", () => {
      const min = adjustValue("min", NaN, data);

      expect(min).toBe(0);
    });
  });

  describe("should adjust 'max'", () => {
    test("< 0", () => {
      const max = adjustValue("max", -130, data);

      expect(max).toBe(data.min + data.step);
    });

    test("> (step + min) make no changes", () => {
      const temp = data.min + data.step + 3;
      const max = adjustValue("max", temp, data);

      expect(max).toBe(temp);
    });

    test("=== (step + min) make no changes", () => {
      const temp = data.step + data.min;
      const max = adjustValue("max", temp, data);

      expect(max).toBe(temp);
    });

    test("=== NaN", () => {
      const max = adjustValue("min", " ", data);

      expect(max).toBe(data.min + data.step);
    });
  });

  describe("should adjust 'currentFirst'", () => {
    test("in a right range make no changes", () => {
      const currentFirst = adjustValue("currentFirst", 11, data);

      expect(currentFirst).toBe(11);
    });

    test("< 0", () => {
      const currentFirst = adjustValue("currentFirst", -11, data);

      expect(currentFirst).toBe(0);
    });

    test("'currentFirst' > 'currentSecond'", () => {
      const currentSecond = data.currentSecond;
      const morethanCS = currentSecond + 10;
      const currentFirst = adjustValue("currentFirst", morethanCS, data);

      expect(currentFirst).toBe(currentSecond);
    });

    test("=== NaN", () => {
      const min = data.min;
      const currentFirst = adjustValue("currentFirst", NaN, data);

      expect(currentFirst).toBe(min);
    });
  });

  describe("should adjust 'currentSecond'", () => {
    test("in a right range", () => {
      const val = 35;
      const currentSecond = adjustValue("currentSecond", val, data);
      const temp = applyStepOnValue(val, data);

      expect(currentSecond).toBe(temp);
    });

    test("< 0", () => {
      const currentSecond = adjustValue("currentSecond", -35, data);

      expect(currentSecond).toBe(33);
    });

    test("< 'currentFirst'", () => {
      const currentFirst = data.currentFirst;
      const lessThanCF = currentFirst - 10;
      const currentSecond = adjustValue("currentSecond", lessThanCF, data);

      expect(currentSecond).toBe(currentFirst);
    });

    test("=== NaN", () => {
      const temp = data.currentFirst;
      const currentSecond = adjustValue("currentSecond", NaN, data);

      expect(currentSecond).toBe(temp);
    });

    test("> 'max'", () => {
      const max = data.max;
      const temp = max + 1;
      const currentSecond = adjustValue("currentSecond", temp, data);

      expect(currentSecond).toBe(max);
    });
  });

  describe("should adjust 'step'", () => {
    test("> (max - min)", () => {
      const step = adjustValue("step", 108, data);

      expect(step).toBe(100);
    });

    test("< (max - min)", () => {
      const temp = data.max - data.min - 1;
      const step = adjustValue("step", temp, data);

      expect(step).toBe(temp);
    });

    test("=== (max-min)", () => {
      const temp = data.max - data.min;
      const step = adjustValue("step", temp, data);

      expect(step).toBe(temp);
    });

    test("=== NaN", () => {
      const step = adjustValue("step", NaN, data);

      expect(step).toBe(1);
    });

    test("< 0", () => {
      const step = adjustValue("step", -2, data);

      expect(step).toBe(1);
    });
  });
});
