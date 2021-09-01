/**
 * @jest-environment jsdom
 */

import { SliderPresenter } from "mvp/presenter";
import { SliderModel } from "mvp/model";
import { SliderView } from "mvp/view";
import { sliderData } from "mvp/data";

const container = document.createElement("div");
container.innerHTML = "div {width: 400px, height: 400px}";
document.body.append(container);

const model = new SliderModel(container, sliderData);
const view = new SliderView(container);
const presenter = new SliderPresenter(model, view);

describe("SliderPresenter", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("method init()", () => {
    describe("should process events from view", () => {
      presenter.containerSize = 400;
      presenter.thumbWidth = 20;

      test("click closer to thumbFirst -> nofity Model.changeThumb()", () => {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100,
        });
        presenter.changingObject = presenter.view.sliderThumb.element;
        const spyModelUpdate = jest.spyOn(presenter.model, "changeThumb").mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("click closer to thumbSecond -> notify model.changeThumbSecond()", () => {
        const event = new MouseEvent("click", {
          clientX: 300,
          clientY: 300,
        });
        presenter.changingObject = presenter.view.sliderThumbSecond.element;
        const spyModelUpdate = jest
          .spyOn(presenter.model, "changeThumbSecond")
          .mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("click on equal distance from thumbs -> change defined thumb in model", () => {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: 188,
          clientY: 188,
        });
        const spyOnModelThumbSecond = jest
          .spyOn(presenter.model, "changeThumbSecond")
          .mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyOnModelThumbSecond).toHaveBeenCalledTimes(1);
      });

      test("drag thumbFirst -> notify model to change thumbFirst", () => {
        const event = new MouseEvent("mousemove", { clientX: 100, clientY: 100 });
        presenter.view.sliderThumb.element.dispatchEvent(new Event("pointerdown"));
        presenter.view.sliderThumb.element.dispatchEvent(event);
        const spyModelUpdate = jest.spyOn(presenter.model, "changeThumb").mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("drag thumbSecond -> notify model to change thumbSecond", () => {
        presenter.model.setData("range", true);
        const event = new MouseEvent("mousemove", { clientX: 300, clientY: 300 });
        presenter.view.sliderThumbSecond.element.dispatchEvent(new Event("pointerdown"));
        presenter.view.sliderThumbSecond.element.dispatchEvent(event);
        const spyModelUpdate = jest
          .spyOn(presenter.model, "changeThumbSecond")
          .mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("drag thumbSecond + new position not in the range -> no changes", () => {
        const event = new MouseEvent("mousemove", { clientX: 50, clientY: 50 });
        presenter.view.sliderThumbSecond.element.dispatchEvent(new Event("pointerdown"));
        presenter.view.sliderThumbSecond.element.dispatchEvent(event);

        const spyModelFirstUpd = jest.spyOn(presenter.model, "changeThumb").mockImplementation();
        const spyModelSecondUpd = jest
          .spyOn(presenter.model, "changeThumbSecond")
          .mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelFirstUpd).toHaveBeenCalledTimes(0);
        expect(spyModelSecondUpd).toHaveBeenCalledTimes(0);
      });
    });

    describe("should process events from model", () => {
      test("should notify subscribers for changes in currentThumb", () => {
        const value = 18;
        presenter.changingObject = presenter.view.sliderThumb.element;
        const spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbUpdate, "notify");
        const spyFromModelChangeView = jest.spyOn(presenter.view, "change").mockImplementation();

        model.fromModelChangeView.notify(value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith(value);
        expect(spyFromModelChangeView).toHaveBeenCalledWith(
          presenter.view.sliderThumb.element,
          value
        );
      });

      test("should notify subscribers for changes in currentThumbSecond", () => {
        const value = 18;
        presenter.changingObject = view.sliderThumbSecond.element;
        const spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbSecondUpdate, "notify");
        const spyFromModelChangeView = jest.spyOn(presenter.view, "change").mockImplementation();

        model.fromModelChangeView.notify(value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith(value);
        expect(spyFromModelChangeView).toHaveBeenCalledWith(
          presenter.view.sliderThumbSecond.element,
          value
        );
      });
    });

    describe("should process full data updates in model", () => {
      test("calls updateView method", () => {
        const spyUpdateView = jest.spyOn(presenter, "updateView");

        model.fromModelUpdateData.notify();

        expect(spyUpdateView).toHaveBeenCalledTimes(1);
      });
      test("notify subscribers", () => {
        const spyfromPresenterUpdate = jest.spyOn(presenter.fromPresenterUpdate, "notify");

        model.fromModelUpdateData.notify();

        expect(spyfromPresenterUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("method updateView()", () => {
    test("should get data from model", () => {
      presenter.init();

      expect(presenter.data).toEqual(model.getData());
    });

    test("should initiate view", () => {
      const spyOnView = jest.spyOn(view, "init");

      presenter.init();

      expect(spyOnView).toHaveBeenCalledTimes(1);
      expect(spyOnView).toHaveBeenCalledWith(model.getData());
    });
  });

  describe("method modelData()", () => {
    test("should call model.modelData() with provided params", () => {
      const name = "min";
      const data = 15;
      const spySetDataInModel = jest.spyOn(model, "setData");

      presenter.modelData(name, data);
      expect(spySetDataInModel).toHaveBeenCalledTimes(1);
      expect(spySetDataInModel).toHaveBeenCalledWith(name, data);
    });
  });
});

const VS = {
  orientation: "vertical",
  range: false,
};
const sliderDataVS = { ...sliderData, ...VS };
const modelVS = new SliderModel(container, sliderDataVS);
const viewVS = new SliderView(container);
const presenterVS = new SliderPresenter(modelVS, viewVS);

describe("should work for single and vertical sliders", () => {
  test("method selectThumb()", () => {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    presenterVS.changingObject = presenterVS.view.sliderThumb.element;
    const spyModelUpdate = jest.spyOn(presenterVS.model, "changeThumb").mockImplementation();

    presenterVS.view.fromViewSelectThumb.notify(event);

    expect(spyModelUpdate).toHaveBeenCalledTimes(1);
  });

  test("method dragThumb()", () => {
    const event = new MouseEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    const spyOnModelChange = jest.spyOn(presenterVS.model, "changeThumb");

    presenterVS.view.fromViewDragThumb.notify(event);

    expect(spyOnModelChange).toHaveBeenCalled();
  });
});
