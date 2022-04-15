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

  describe('method updateView()', () => {
    test('should get data from model', () => {
      presenter.init();

      const data = presenter.getData();

      expect(data).toEqual(presenter.model.getData());
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
  test('process data from model to view', () => {
    const val = 28;
    const spyViewUpdate = jest.spyOn(
      presenterVS.view, 
      'changeThumb'
    ).mockImplementation();

    presenterVS.model.setData('currentFirst', val);

    expect(spyViewUpdate).toHaveBeenCalled();
  });

  test('method dragThumb()', () => {
    const evt = new Event('pointerup', {
      bubbles: true,
      cancelable: false,
      composed: false
    });
    const spyOnModelChange = jest.spyOn(
      presenterVS.model, 
      'setData'
    ).mockImplementation();
    
    debugger;
    presenterVS.view.selectThumb(evt as PointerEvent);

    expect(spyOnModelChange).toHaveBeenCalledTimes(1);
  });
});