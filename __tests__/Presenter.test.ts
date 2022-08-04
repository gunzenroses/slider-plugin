/**
 * @jest-environment jsdom
 */

import initialData from 'src/scripts/initialData';
import Presenter from 'Presenter/Presenter';
import TOrient from 'utils/const';

const container = document.createElement('div');
container.innerHTML = 'div {width: 400px, height: 400px}';
document.body.append(container);

const presenter = new Presenter(container, initialData);

describe('Presenter', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('method init()', () => {
    test('should initiate model', () => {
      const setData = presenter.getData();

      expect(setData).toBeDefined();
    });
  });

  describe('method setData()', () => {
    test('update Model', () => {
      const name = 'min';
      const data = 15;
      presenter.setData(name, data);

      const newMin = presenter.getData().min;
      expect(newMin).toBe(data);
    });

    test('update currentFirst', () => {
      const name = 'currentFirst';
      const data = 25;
      presenter.setData(name, data);

      const newCurrentFirst = presenter.getData().currentFirst;
      expect(newCurrentFirst).toBe(data);
    });

    test('update currentSecond', () => {
      const name = 'currentSecond';
      const data = 35;
      presenter.setData(name, data);

      const newCurrentSecond = presenter.getData().currentSecond;
      expect(newCurrentSecond).toBe(data);
    });
  });

  describe('mediate data from view to model', () => {
    it('change thumb data by clicking on document', () => {
      const firstThumbOld = presenter.getData().currentFirst;
      const evt = new Event('pointerup', { bubbles: true });

      container.dispatchEvent(evt);
      const firstThumbNew = presenter.getData().currentFirst;
      expect(firstThumbOld).not.toBe(firstThumbNew);
    });
  });
});
