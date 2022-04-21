/**
 * @jest-environment jsdom
 */

import initialData from 'scripts/initialData';
import IView from 'src/components/Interfaces/IView';
import View from 'View/View';

describe('class View', () => {
  const data = initialData;
  const container = document.createElement('div');
  document.body.append(container);
  let view: IView;

  const pointerUpEvt = new Event("pointerup", {
    bubbles: true,
    cancelable: false,
    composed: false,
  });

  beforeEach(() => {
    container.innerHTML = '';
    view = new View(container);
    view.init(data);
    view.thumbWidth = 8;
    view.containerSize = 400;
    jest.restoreAllMocks();
  });

  describe('method init()', () => {
    test('render the view', () => {
      view.init(data);
      
      expect(view.range).toBeDefined();
    })
  })

  describe('method selectThumb()', () => {
    test('notify listeners when position of thumb is changed', () => {
      view.selectThumb(pointerUpEvt as PointerEvent);

      expect(view.thumbs.thumbFirst).not.toBe(data.currentFirst);
    })
  })

  describe('method dragThumbEnd()', () => {
    test('set listeners for new dragging', () => {
      const spyOnDragStart = jest.spyOn(view, 'dragThumbStart');

      const pointerDownEvt = new Event("pointerdown", {
        bubbles: true,
        cancelable: false,
        composed: false,
      })

      view.dragThumbEnd();
      view.thumbs.thumbSecond.dispatchEvent(pointerDownEvt);

      expect(spyOnDragStart).toBeCalledTimes(1);
    })
  })

  describe('method changeThumb()', () => {
    test('change thumbFirst', () => {
      const num = 20;
      view.changeThumb('thumbFirst', num);

      expect(view.settings.currentFirst).toBe(num);
    });
    test('change thumbSecond', () => {
      const num = 30;
      view.changeThumb('thumbSecond', num);

      expect(view.settings.currentSecond).toBe(num);
    })
  })

  describe('method createSettings()', () => {
    test('create settings for class functionality', () => {
      expect(view.settings.ifHorizontal).toBeDefined();
      expect(view.settings.range).toBeDefined();
      expect(view.settings.tooltip).toBeDefined();
      expect(view.settings.scale).toBeDefined();
      expect(view.settings.currentFirst).toBeTruthy();
      expect(view.settings.currentSecond).toBeTruthy();
      expect(view.settings.step).toBeTruthy();
      expect(view.settings.max).toBeTruthy();
      expect(view.settings.min).toBeDefined();
      expect(view.settings.ifHorizontal).toBeDefined();
      expect(view.settings.firstPosition).toBeDefined();
      expect(view.settings.secondPosition).toBeDefined();
    });
  });

  describe('method dragThumbStart()', () => {
    test('disable pointerdown eventListener', () => {
      const newSet = {
        ...data,
        range: false,
      };
      view.init(newSet);
      view.thumbs.thumbFirst.dispatchEvent(new Event('pointerdown'));
      document.dispatchEvent(new Event('pointermove'));
      const spyOnDragStart = jest.spyOn(view, 'dragThumbStart');

      view.thumbs.thumbFirst.dispatchEvent(new Event('pointerdowm'));

      expect(spyOnDragStart).toHaveBeenCalledTimes(0);
    });
  });

  describe('method stopListenDown()', () => {
    test('do not listen to thumbDown events when thumbMove', () => {
      const spyOnThumbDown = jest.spyOn(view, 'dragThumbStart');

      document.dispatchEvent(new Event('pointerdown'));

      expect(spyOnThumbDown).toBeCalledTimes(0);
    });
  });

  describe('method render()', () => {
    test('init rendering view elements', () => {
      expect(view.container).toBeDefined();
      expect(view.track).toBeDefined();
      expect(view.range).toBeDefined();
      expect(view.thumbs.thumbFirst).toBeDefined();
      expect(view.thumbs.thumbSecond).toBeDefined();
      expect(view.scale).toBeDefined();
    });

    test('disable elements when !ifScale, !ifTooltip, !ifRange', () => {
      const newData = {
        scale: false,
        tooltip: false,
        range: false,
      };
      const updatedData = { ...initialData, ...newData };

      view.init(updatedData);

      expect(view.scale.classList.contains('scale_disabled')).toBe(true);
    });
  });
});
