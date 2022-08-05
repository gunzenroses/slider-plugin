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

const pointerDownEvt = new Event('pointerdown', {
  bubbles: true,
});

const pointerDragEvt = new Event('pointermove', {
  bubbles: true,
});

const pointerUpEvt = new Event('pointerup', { bubbles: true });

describe('Presenter Horizontal Range', () => {
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
    test('do not change thumbFirst when clicked on', () => {
      const spyOnGetData = jest.spyOn(presenter, 'getData');

      const thumbFirst = container.getElementsByClassName('thumb_first')[0];
      thumbFirst.dispatchEvent(pointerUpEvt);

      expect(spyOnGetData).toHaveBeenCalledTimes(0);
    });

    test('change thumbFirst when clicked on container', () => {
      const spyOnGetData = jest.spyOn(presenter, 'getData');

      container.dispatchEvent(pointerUpEvt);
      expect(spyOnGetData).toHaveBeenCalledTimes(1);
    });
    
    test('update data when thumbFirst is dragged', () => {
      const spyOnGetData = jest.spyOn(presenter, 'getData');

      const thumbFirst = container.getElementsByClassName('thumb_first')[0];
      thumbFirst.dispatchEvent(pointerDownEvt);
      document.dispatchEvent(pointerDragEvt);
      
      expect(spyOnGetData).toHaveBeenCalledTimes(1);
    });

    test('update data when thumbSecond is dragged', () => {
      const spyOnGetData = jest.spyOn(presenter, 'getData');

      const thumbSecond = container.getElementsByClassName('thumb_second')[0];
      thumbSecond.dispatchEvent(pointerDownEvt);
      document.dispatchEvent(pointerDragEvt);

      expect(spyOnGetData).toHaveBeenCalledTimes(2);
    });
  });
});

const containerVS = document.createElement('div');
containerVS.innerHTML = 'div {width: 400px, height: 400px}';
document.body.append(containerVS);

const VS = {
  orientation: TOrient.VERTICAL,
  range: false,
};
const initialDataVS = { ...initialData, ...VS };
const presenterVS = new Presenter(containerVS, initialDataVS);

describe('Presenter Vertical Single', () => {
  test('method dragThumb() upd data', () => {
    const spyOnGetDataVS = jest.spyOn(presenterVS, 'getData');

    const thumbFirst = containerVS.getElementsByClassName('thumb')[0];
    thumbFirst.dispatchEvent(pointerDownEvt);
    document.dispatchEvent(pointerDragEvt);

    expect(spyOnGetDataVS).toHaveBeenCalledTimes(1);
  });

  test('method dragThumb() upd data', () => {
    jest.restoreAllMocks();
    const spyOnGetData = jest.spyOn(presenterVS, 'getData');

    containerVS.dispatchEvent(pointerUpEvt);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
  });
});
