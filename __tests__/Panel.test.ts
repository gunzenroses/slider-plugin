/*
 * @jest-environment jsdom
 */

import initialData from 'scripts/initialData';
import Panel from 'Panel/Panel';
import Presenter from 'Presenter/Presenter';

const container = document.createElement('div');
document.body.append(container);

const presenter = new Presenter(container, initialData);
const panel = new Panel(container, presenter);

describe('Panel for double slider', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('method init()', () => {
    test('should create panel items', () => {
      const spyRender = jest.spyOn(panel, 'render');

      panel.init();

      expect(spyRender).toHaveBeenCalledTimes(1);
    });
  });

  describe('method changePanel()', () => {
    test('should update data', () => {
      const spyPresenter = jest
        .spyOn(panel.presenter, 'setData')
        .mockImplementation();
      const trg = panel.container.querySelector('input[name="range"]');
      const evt = {
        ...new Event('click'),
        target: trg,
      };

      panel.changePanel(evt);

      expect(spyPresenter).toHaveBeenCalledTimes(1);
    });

    test('should use setTimeout to update data with type "number"', async () => {
      jest.useFakeTimers();
      const spyPresenter = jest
        .spyOn(panel.presenter, 'setData')
        .mockImplementation();
      const trg: HTMLInputElement | null = panel.container.querySelector(
        'input[name = "max"]'
      );
      if (trg !== null) {
        const event = new Event('change');
        trg.value = '';

        trg.dispatchEvent(event);
        panel.changePanel(event);
        jest.runAllTimers();

        expect(spyPresenter).toHaveBeenCalledTimes(1);
      }
    });
  });
});

describe('method updatePanel()', () => {
  test('', () => {
    const newMin = -10;
    const newMax = 120;
    const newData = {
      ...initialData,
      min: newMin,
      max: newMax,
    };

    panel.updatePanel(newData);

    expect(panel.data.min).toBe(newMin);
    expect(panel.data.max).toBe(newMax);
  });
});

const newData = { ...initialData, range: false, tooltip: false, scale: false };
const presenterS = new Presenter(container, newData);
const panelS = new Panel(container, presenterS);
describe('Panel for single slider', () => {
  test('should disable input for currentSecond', () => {
    const currentSecondInput = <HTMLInputElement>(
      panelS.container.querySelector("input[name = 'currentSecond']")
    );

    expect(currentSecondInput.disabled).toBe(true);
  });
});
