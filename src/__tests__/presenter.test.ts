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

      test("should notify model.changeThumb() to change thumbFirst", () => {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100,
        });
        presenter.changingObject = presenter.view.sliderThumb;

        const spyModelUpdate = jest.spyOn(presenter.model, "changeThumb").mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("should notify model.changeThumb() to change thumbSecond", () => {
        const event = new MouseEvent("click", {
          clientX: 300,
          clientY: 300,
        });
        presenter.changingObject = presenter.view.sliderThumbSecond;
        const spyModelUpdate = jest
          .spyOn(presenter.model, "changeThumbSecond")
          .mockImplementation();

        presenter.view.fromViewSelectThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("should notify model.changeThumb() to chang thumbFirst, when it was dragged", () => {
        const event = new MouseEvent("mousemove", {
          clientX: 100,
          clientY: 100,
        });
        presenter.view.dragObject = presenter.view.sliderThumb;
        const spyModelUpdate = jest.spyOn(presenter.model, "changeThumb").mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });

      test("should notify model.changeThumb() to chang thumbSecond, when it was dragged", () => {
        const event = new MouseEvent("mousemove", {
          clientX: 300,
          clientY: 300,
        });
        presenter.view.dragObject = presenter.view.sliderThumbSecond;
        const spyModelUpdate = jest
          .spyOn(presenter.model, "changeThumbSecond")
          .mockImplementation();

        presenter.view.fromViewDragThumb.notify(event);

        expect(spyModelUpdate).toHaveBeenCalledTimes(1);
      });
    });

    describe("should process events from model", () => {
      test("should notify subscribers for changes in currentThumb", () => {
        const value = 18;
        presenter.changingObject = presenter.view.sliderThumb;
        const spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbUpdate, "notify");
        const spyFromModelChangeView = jest.spyOn(presenter.view, "change").mockImplementation();

        model.fromModelChangeView.notify(value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith(value);
        expect(spyFromModelChangeView).toHaveBeenCalledWith(presenter.view.sliderThumb, value);
      });

      test("should notify subscribers for changes in currentThumbSecond", () => {
        const value = 18;
        presenter.changingObject = view.sliderThumbSecond;
        const spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbSecondUpdate, "notify");
        const spyFromModelChangeView = jest.spyOn(presenter.view, "change").mockImplementation();

        model.fromModelChangeView.notify(value);

        expect(spyfromModelUpdate).toHaveBeenCalledWith(value);
        expect(spyFromModelChangeView).toHaveBeenCalledWith(
          presenter.view.sliderThumbSecond,
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
