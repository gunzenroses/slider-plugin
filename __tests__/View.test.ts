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

  const pointerUpEvt = new Event('pointerup', {
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
      const range = container.getElementsByClassName('range')[0];
      const thumbFirst = container.getElementsByClassName('thumb_first')[0];
      const thumbSecond = container.getElementsByClassName('thumb_second')[0];
      const scale = container.getElementsByClassName('scale')[0];
      const track = container.getElementsByClassName('track')[0];

      expect(range).toBeDefined();
      expect(thumbFirst).toBeDefined();
      expect(thumbSecond).toBeDefined();
      expect(scale).toBeDefined();
      expect(track).toBeDefined();
    });
  });

  describe('method changeThumb()', () => {
    test('change thumbFirst', () => {
      const thumbFirst = container.getElementsByClassName('thumb_first')[0];
      const value = 12;
      view.changeThumb('thumbFirst', value);
      const thumbActive = container.getElementsByClassName('thumb_active')[0];

      expect(thumbFirst).toBe(thumbActive);
    });

    test('change thumbSecond', () => {
      const thumbSecond = container.getElementsByClassName('thumb_second')[0];
      const value = 12;
      view.changeThumb('thumbSecond', value);
      const thumbActive = container.getElementsByClassName('thumb_active')[0];

      expect(thumbSecond).toBe(thumbActive);
    });
  });
});
