/**
 * @jest-environment jsdom
 */

import { Presenter } from "mvp/presenter";
import { sliderData } from "mvp/data";

const container = document.createElement("div");
container.innerHTML = "div {width: 400px, height: 400px}";
document.body.append(container);

const presenter = new Presenter(container, sliderData);

describe("Presenter", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("method init()", () => {
    describe("should process events from view", () => {
      presenter.containerSize = 400;
      presenter.thumbWidth = 20;

      test("click close to thumbFirst -> nofity Model.setData()", () => {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100,
        });
        presenter.changingObject = presenter.view.thumb.element;
        const spyModelUpdate = jest.spyOn(presenter.model, "setData").mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("click close to thumbSecond -> notify model.changeThumbSecond()", () => {
        const event = new MouseEvent("click", {
          clientX: 300,
          clientY: 300,
        });
        presenter.changingObject = presenter.view.thumbSecond.element;
        const spyModelUpdate = jest.spyOn(presenter.model, "setData").mockImplementation();

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
        const spyOnModelThumbSecond = jest.spyOn(presenter.model, "setData").mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyOnModelThumbSecond).toHaveBeenCalledTimes(1);
      });

      test("drag thumbFirst -> notify model to change thumbFirst", () => {
        const event = new MouseEvent("mousemove", { clientX: 100, clientY: 100 });
        presenter.view.thumb.element.dispatchEvent(new Event("pointerdown"));
        presenter.view.thumb.element.dispatchEvent(event);
        const spyModelUpdate = jest.spyOn(presenter.model, "setData").mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("drag thumbSecond -> notify model to change thumbSecond", () => {
        const event = new MouseEvent("mousemove", { clientX: 250, clientY: 250 });
        presenter.view.thumbSecond.element.dispatchEvent(new Event("pointerdown"));
        presenter.view.thumbSecond.element.dispatchEvent(event);
        const spyModelUpdate = jest.spyOn(presenter.model, "setData").mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("drag thumbSecond + new position not in the range -> no changes", () => {
        const event = new MouseEvent("mousemove", { clientX: 50, clientY: 50 });
        presenter.view.thumbSecond.element.dispatchEvent(new Event("pointerdown"));
        presenter.view.thumbSecond.element.dispatchEvent(event);

        const spyModelFirstUpd = jest.spyOn(presenter.model, "setData").mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelFirstUpd).toHaveBeenCalledTimes(0);
      });
    });

    describe("should process events from model", () => {
      test("should notify subscribers for changes in currentThumb", () => {
        const value = 18;
        presenter.changingObject = presenter.view.thumb.element;
        const spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbUpdate, "notify");
        const spyFromModelChangeView = jest.spyOn(presenter.view, "change").mockImplementation();

        presenter.model.fromModelChangeView.notify(value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith(value.toString());
        expect(spyFromModelChangeView).toHaveBeenCalledWith(
          presenter.view.thumb.element,
          value
        );
      });

      test("should notify subscribers for changes in currentThumbSecond", () => {
        const value = 18;
        presenter.changingObject = presenter.view.thumbSecond.element;
        const spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbSecondUpdate, "notify");
        const spyFromModelChangeView = jest.spyOn(presenter.view, "change").mockImplementation();

        presenter.model.fromModelChangeView.notify(value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith(value.toString());
        expect(spyFromModelChangeView).toHaveBeenCalledWith(
          presenter.view.thumbSecond.element,
          value
        );
      });
    });

    describe("should process full data updates in model", () => {
      test("calls updateView method", () => {
        const spyUpdateView = jest.spyOn(presenter, "updateView");

        presenter.model.fromModelUpdateData.notify();

        expect(spyUpdateView).toHaveBeenCalledTimes(1);
      });
      test("notify subscribers", () => {
        const spyfromPresenterUpdate = jest.spyOn(presenter.fromPresenterUpdate, "notify");

        presenter.model.fromModelUpdateData.notify();

        expect(spyfromPresenterUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("method updateView()", () => {
    test("should get data from model", () => {
      presenter.init();

      expect(presenter.data).toEqual(presenter.model.getData());
    });

    test("should initiate view", () => {
      const spyOnView = jest.spyOn(presenter.view, "init");

      presenter.init();

      expect(spyOnView).toHaveBeenCalledTimes(1);
      expect(spyOnView).toHaveBeenCalledWith(presenter.model.getData());
    });
  });

  describe("method modelData()", () => {
    test("should call model.modelData() with provided params", () => {
      const name = "min";
      const data = 15;
      const spySetDataInModel = jest.spyOn(presenter.model, "setData");

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
const presenterVS = new Presenter(container, sliderDataVS);

describe("should work for single and vertical sliders", () => {
  test("method selectThumb()", () => {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    presenterVS.changingObject = presenterVS.view.thumb.element;
    const spyModelUpdate = jest.spyOn(presenterVS.model, "setData").mockImplementation();

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
    const spyOnModelChange = jest.spyOn(presenterVS.model, "setData");

    presenterVS.view.fromViewDragThumb.notify(event);

    expect(spyOnModelChange).toHaveBeenCalled();
  });
});
