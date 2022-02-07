/**
 * @jest-environment jsdom
 */

import initialData from 'src/scripts/initialData';
import Presenter from 'Presenter/Presenter';
import { TOrient } from 'utils/const';

const container = document.createElement('div');
container.innerHTML = 'div {width: 400px, height: 400px}';
document.body.append(container);

const presenter = new Presenter(container, initialData);

describe('Presenter', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('method init()', () => {
    describe('should process events from view', () => {
      test('process notifications from view to change currentFirst in model', () => {
        const spyModelUpdate = jest.spyOn(presenter.model, 'setData').mockImplementation();

        presenter.view.eventDispatcher.notify('firstThumb', 20);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test('process notifications from view to change currentSecond in model', () => {
        const spyModelUpdate = jest.spyOn(presenter.model, 'setData').mockImplementation();

        presenter.view.eventDispatcher.notify('secondThumb', 200);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });
    });

    describe('should process events from model', () => {
      test('should notify subscribers for changes in currentThumb', () => {
        const value = 18;
        const spyfromModelUpdate = jest.spyOn(presenter.eventDispatcher, 'notify');
        const spyFromModelChangeView = jest.spyOn(presenter.view, 'changeFirstThumb').mockImplementation();

        presenter.model.eventDispatcher.notify('thumbUpdate', value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith('thumbUpdate', value);
        expect(spyFromModelChangeView).toHaveBeenCalledWith(value);
      });

      test('should notify subscribers for changes in currentThumbSecond', () => {
        const value = 18;
        const spyfromModelUpdate = jest.spyOn(presenter.eventDispatcher, 'notify');
        const spyFromModelChangeView = jest.spyOn(presenter.view, 'changeSecondThumb').mockImplementation();

        presenter.model.eventDispatcher.notify('thumbSecondUpdate', value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith('thumbSecondUpdate', value);
        expect(spyFromModelChangeView).toHaveBeenCalledWith(value);
      });
    });

    describe('process updates of data in model', () => {
      test('by updating view', () => {
        const spyUpdateView = jest.spyOn(presenter, 'updateView');

        presenter.model.eventDispatcher.notify('updateData');

        expect(spyUpdateView).toHaveBeenCalledTimes(1);
      });

      test('by notifying subscribers', () => {
        const spyUpdateAll = jest.spyOn(presenter.eventDispatcher, 'notify');

        presenter.model.eventDispatcher.notify('updateData');

        expect(spyUpdateAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('method updateView()', () => {
    test('should get data from model', () => {
      presenter.init();

      expect(presenter.data).toEqual(presenter.model.getData());
    });

    test('should initiate view', () => {
      const spyOnView = jest.spyOn(presenter.view, 'init');

      presenter.init();

      expect(spyOnView).toHaveBeenCalledTimes(1);
      expect(spyOnView).toHaveBeenCalledWith(presenter.model.getData());
    });
  });

  describe('method modelData()', () => {
    test('should call process data to update Model', () => {
      const name = 'min';
      const data = 15;
      const spySetDataInModel = jest.spyOn(presenter.model, 'setData');

      presenter.modelData(name, data);
      expect(spySetDataInModel).toHaveBeenCalledTimes(1);
      expect(spySetDataInModel).toHaveBeenCalledWith(name, data);
    });
  });
});

const VS = {
  orientation: TOrient.VERTICAL,
  range: false,
};
const initialDataVS = { ...initialData, ...VS };
const presenterVS = new Presenter(container, initialDataVS);

describe('should work for single and vertical sliders', () => {
  test('method selectThumb()', () => {
    const val = 28;
    const spyModelUpdate = jest.spyOn(presenterVS.model, 'setData').mockImplementation();

    presenterVS.view.eventDispatcher.notify('firstThumb', val);

    expect(spyModelUpdate).toHaveBeenCalledWith('currentFirst', val);
  });

  test('method dragThumb()', () => {
    const val = 212;
    const spyOnModelChange = jest.spyOn(presenterVS.model, 'setData').mockImplementation();

    presenterVS.view.eventDispatcher.notify('secondThumb', val);

    expect(spyOnModelChange).toHaveBeenCalledWith('currentSecond', val);
  });
});
