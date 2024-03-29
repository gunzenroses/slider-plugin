/**
 * @jest-environment jsdom
 */

import initialData from 'src/scripts/initialData';
import IModel from 'src/components/Interfaces/IModel';
import Model from 'Model/Model';
import adjustValue from 'helpers/adjustValue';

describe('class Model', () => {
  let data: TSettings;
  let model: IModel;

  beforeEach(() => {
    data = initialData;
    model = new Model(data);
    jest.restoreAllMocks();
  });

  describe('method setData', () => {
    test('should update data in model', () => {
      const min = adjustValue({
        name: 'min',
        value: 2, 
        data: model.getData()
      });
      const max = adjustValue({
        name: 'max',
        value: 130, 
        data: model.getData()
      });
      const step = adjustValue({
        name: 'step',
        value: 2, 
        data: model.getData()
      });

      model.setData('step', step);
      model.setData('min', min);
      model.setData('max', max);

      expect(model.getData()).toHaveProperty('step', step);
      expect(model.getData()).toHaveProperty('min', min);
      expect(model.getData()).toHaveProperty('max', max);
    });

    test('should change data.currentFirst', () => {
      const val = 3;

      model.setData('currentFirst', val);

      expect(model.getData()).toHaveProperty('currentFirst', val);
    });

    test('should change data.CurrentSecond', () => {
      const currentFirst = data.currentFirst;
      const num = currentFirst - 5;

      model.setData('currentSecond', num);

      expect(model.getData()).toHaveProperty('currentSecond', currentFirst);
    });
  });

  describe('method getData()', () => {
    test('return object which were passed into constructor data', () => {
      expect(model.getData()).toEqual(data);
    });

    test('have valid properties("min", "max", "range", "currentFirst", "currentSecond", "step", "orientation", "tooltip", "scale")', () => {
      expect(model.getData()).toHaveProperty('min');
      expect(model.getData()).toHaveProperty('max');
      expect(model.getData()).toHaveProperty('range');
      expect(model.getData()).toHaveProperty('currentFirst');
      expect(model.getData()).toHaveProperty('currentSecond');
      expect(model.getData()).toHaveProperty('step');
      expect(model.getData()).toHaveProperty('orientation');
      expect(model.getData()).toHaveProperty('tooltip');
      expect(model.getData()).toHaveProperty('scale');
    });
  });

  describe('method updateCurrentsWithStep()', () => {
    test('should make currentThumb multiple of step', () => {
      const newCF = { name: 'currentFirst', data: 26 };
      const step = model.getData().step;
      const multiple = Math.trunc((newCF.data / step) * step);

      model.setData(newCF.name, newCF.data);

      expect(model.getData().currentFirst).toBe(multiple);
    });

    test('should make currentThumbSecond multiple of "step", when "range" === true', () => {
      const newCF = { name: 'currentSecond', data: 35 };
      const step = model.getData().step;
      const multiple = Math.trunc((newCF.data / step) * step);

      model.setData('range', true);
      model.setData(newCF.name, newCF.data);

      expect(model.getData().currentSecond).toBe(multiple);
    });

    test('should make "currentThumbSecond" === "max", when "range" === false', () => {
      model.setData('range', false);

      expect(model.getData().currentSecond).toBe(model.getData().max);
    });
  });

  describe('when initiated should improve data', () => {
    test('correct when values are grater that they should be', () => {
      const uncorrectedData = {
        min: 100,
        max: 10,
        currentSecond: 200,
        currentFirst: 300,
      };
      const newData = { ...initialData, ...uncorrectedData }
      model = new Model(newData);

      const correctedData = model.getData();

      const { min, max, currentFirst, currentSecond } = correctedData;

      expect(min).toBeLessThanOrEqual(max);
      expect(currentFirst).toBeLessThanOrEqual(currentSecond);
      expect(currentSecond).toBeLessThanOrEqual(max);
    });
    test('correct when values are smaller than they should be', () => {
      const uncorrectedData = {
        min: 10,
        max: 100,
        currentSecond: -12,
        currentFirst: 5,
      };
      const newData = { ...initialData, ...uncorrectedData }
      model = new Model(newData);

      const correctedData = model.getData();

      const { min, max, currentFirst, currentSecond } = correctedData;

      expect(currentFirst).toBeGreaterThanOrEqual(min);
      expect(currentSecond).toBeGreaterThanOrEqual(currentFirst);
    })
  });
});
