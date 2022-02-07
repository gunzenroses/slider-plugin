import initialData from 'scripts/initialData';
import adjustValue from 'helpers/adjustValue';
import { applyStepOnValue } from 'utils/common';

const data = initialData;

describe('adjustValue', () => {
  describe('should adjust "min"', () => {
    test('smaller "max" - "step"', () => {
      const temp = data.max - data.step - 1;
      const min = adjustValue({ name: 'min', value: temp, data: data });

      expect(min).toBe(temp);
    });

    test('equals "max" - "step"', () => {
      const temp = data.max - data.step;
      const min = adjustValue({ name: 'min', value: temp, data: data });

      expect(min).toBe(temp);
    });

    test('grater "max" - "step"', () => {
      const temp = data.max - data.step;
      const min = adjustValue({ name: 'min', value: temp + 1, data: data });

      expect(min).toBe(temp);
    });

    test('equals NaN', () => {
      const temp = data.max - data.step;

      const min = adjustValue({ name: 'min', value: NaN, data: data });

      expect(min).toBe(temp);
    });
  });

  describe('should adjust "max"', () => {
    test('smaller 0', () => {
      const max = adjustValue({ name: 'max', value: -130, data: data });

      expect(max).toBe(data.min + data.step);
    });

    test('grater (step + min) make no changes', () => {
      const temp = data.min + data.step + 3;
      const max = adjustValue({ name: 'max', value: temp, data: data });

      expect(max).toBe(temp);
    });

    test('equals (step + min) make no changes', () => {
      const temp = data.step + data.min;
      const max = adjustValue({ name: 'max', value: temp, data: data });

      expect(max).toBe(temp);
    });

    test('equals NaN', () => {
      const max = adjustValue({ name: 'max', value: ' ', data: data });

      expect(max).toBe(data.min + data.step);
    });
  });

  describe('should adjust "currentFirst"', () => {
    test('in a right range make no changes', () => {
      const currentFirst = adjustValue({ 
        name: 'currentFirst', 
        value: 11, 
        data: data 
      });

      expect(currentFirst).toBe(11);
    });

    test('smaller 0', () => {
      const currentFirst = adjustValue({ 
        name: 'currentFirst', 
        value: -11, 
        data: data
      });

      expect(currentFirst).toBe(0);
    });

    test('"currentFirst" > "currentSecond"', () => {
      const currentSecond = data.currentSecond;
      const morethanCS = currentSecond + 10;
      const currentFirst = adjustValue({
        name: 'currentFirst', 
        value: morethanCS, 
        data: data
      });

      expect(currentFirst).toBe(currentSecond);
    });

    test('equals NaN', () => {
      const min = data.min;
      const currentFirst = adjustValue({
        name: 'currentFirst', 
        value: NaN, 
        data: data
      });

      expect(currentFirst).toBe(min);
    });
  });

  describe('should adjust "currentSecond"', () => {
    test('in a right range', () => {
      const val = 35;
      const currentSecond = adjustValue({
        name: 'currentSecond',
        value: val,
        data: data
      });
      const temp = applyStepOnValue(val, data);

      expect(currentSecond).toBe(temp);
    });

    test('smaller 0', () => {
      const currentSecond = adjustValue({
        name: 'currentSecond',
        value: -35,
        data: data
      });

      expect(currentSecond).toBe(33);
    });

    test('smaller "currentFirst"', () => {
      const currentFirst = data.currentFirst;
      const lessThanCF = currentFirst - 10;
      const currentSecond = adjustValue({
        name: 'currentSecond',
        value: lessThanCF,
        data: data
      });

      expect(currentSecond).toBe(currentFirst);
    });

    test('equals NaN', () => {
      const temp = data.max;
      const currentSecond = adjustValue({
        name: 'currentSecond',
        value: NaN, 
        data: data
      });

      expect(currentSecond).toBe(temp);
    });

    test('grater "max"', () => {
      const max = data.max;
      const temp = max + 1;
      const currentSecond = adjustValue({
        name: 'currentSecond',
        value: temp, 
        data: data
      });

      expect(currentSecond).toBe(max);
    });
  });

  describe('should adjust "step"', () => {
    test('grater (max - min)', () => {
      const step = adjustValue({
        name: 'step',
        value: 108, 
        data: data
      });

      expect(step).toBe(108);
    });

    test('smaller (max - min)', () => {
      const temp = data.max - data.min - 1;
      const step = adjustValue({
        name: 'step',
        value: temp, 
        data: data
      });

      expect(step).toBe(temp);
    });

    test('equals (max-min)', () => {
      const temp = data.max - data.min;
      const step = adjustValue({
        name: 'step', 
        value: temp,
        data: data
      });

      expect(step).toBe(temp);
    });

    test('equals NaN', () => {
      const step = adjustValue({
        name: 'step', 
        value: NaN,
        data: data
      });

      expect(step).toBe(1);
    });

    test('smaller 0', () => {
      const step = adjustValue({
        name: 'step', 
        value: -2,
        data: data
      });

      expect(step).toBe(1);
    });
  });
});
