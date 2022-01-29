import initialData from 'scripts/initialData';
import adjustValue from 'helpers/adjustValue';
import { applyStepOnValue } from 'utils/common';

const data = initialData;

describe('adjustValue', () => {
  describe('should adjust "min"', () => {
    test('smaller "max" - "step"', () => {
      const temp = data.max - data.step - 1;
      const min = adjustValue('min', temp, data);

      expect(min).toBe(temp);
    });

    test('equals "max" - "step"', () => {
      const temp = data.max - data.step;
      const min = adjustValue('min', temp, data);

      expect(min).toBe(temp);
    });

    test('grater "max" - "step"', () => {
      const temp = data.max - data.step;
      const min = adjustValue('min', temp + 1, data);

      expect(min).toBe(temp);
    });

    test('equals NaN', () => {
      const temp = data.max - data.step;

      const min = adjustValue('min', NaN, data);

      expect(min).toBe(temp);
    });
  });

  describe('should adjust "max"', () => {
    test('smaller 0', () => {
      const max = adjustValue('max', -130, data);

      expect(max).toBe(data.min + data.step);
    });

    test('grater (step + min) make no changes', () => {
      const temp = data.min + data.step + 3;
      const max = adjustValue('max', temp, data);

      expect(max).toBe(temp);
    });

    test('equals (step + min) make no changes', () => {
      const temp = data.step + data.min;
      const max = adjustValue('max', temp, data);

      expect(max).toBe(temp);
    });

    test('equals NaN', () => {
      const max = adjustValue('max', ' ', data);

      expect(max).toBe(data.min + data.step);
    });
  });

  describe('should adjust "currentFirst"', () => {
    test('in a right range make no changes', () => {
      const currentFirst = adjustValue('currentFirst', 11, data);

      expect(currentFirst).toBe(11);
    });

    test('smaller 0', () => {
      const currentFirst = adjustValue('currentFirst', -11, data);

      expect(currentFirst).toBe(0);
    });

    test('"currentFirst" > "currentSecond"', () => {
      const currentSecond = data.currentSecond;
      const morethanCS = currentSecond + 10;
      const currentFirst = adjustValue('currentFirst', morethanCS, data);

      expect(currentFirst).toBe(currentSecond);
    });

    test('equals NaN', () => {
      const min = data.min;
      const currentFirst = adjustValue('currentFirst', NaN, data);

      expect(currentFirst).toBe(min);
    });
  });

  describe('should adjust "currentSecond"', () => {
    test('in a right range', () => {
      const val = 35;
      const currentSecond = adjustValue('currentSecond', val, data);
      const temp = applyStepOnValue(val, data);

      expect(currentSecond).toBe(temp);
    });

    test('smaller 0', () => {
      const currentSecond = adjustValue('currentSecond', -35, data);

      expect(currentSecond).toBe(33);
    });

    test('smaller "currentFirst"', () => {
      const currentFirst = data.currentFirst;
      const lessThanCF = currentFirst - 10;
      const currentSecond = adjustValue('currentSecond', lessThanCF, data);

      expect(currentSecond).toBe(currentFirst);
    });

    test('equals NaN', () => {
      const temp = data.max;
      const currentSecond = adjustValue('currentSecond', NaN, data);

      expect(currentSecond).toBe(temp);
    });

    test('grater "max"', () => {
      const max = data.max;
      const temp = max + 1;
      const currentSecond = adjustValue('currentSecond', temp, data);

      expect(currentSecond).toBe(max);
    });
  });

  describe('should adjust "step"', () => {
    test('grater (max - min)', () => {
      const step = adjustValue('step', 108, data);

      expect(step).toBe(108);
    });

    test('smaller (max - min)', () => {
      const temp = data.max - data.min - 1;
      const step = adjustValue('step', temp, data);

      expect(step).toBe(temp);
    });

    test('equals (max-min)', () => {
      const temp = data.max - data.min;
      const step = adjustValue('step', temp, data);

      expect(step).toBe(temp);
    });

    test('equals NaN', () => {
      const step = adjustValue('step', NaN, data);

      expect(step).toBe(1);
    });

    test('smaller 0', () => {
      const step = adjustValue('step', -2, data);

      expect(step).toBe(1);
    });
  });
});
