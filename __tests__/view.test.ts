/**
 * @jest-environment jsdom
 */

import { initialData } from "src/components/initialData";
import IView from "src/components/interfaces/IView";
import View from "mvp/View/View";

describe("class View", () => {
  const data = initialData;
  const container = document.createElement("div");
  document.body.append(container);
  let view: IView;

  beforeEach(() => {
    container.innerHTML = "";
    view = new View(container);
    view.init(data);
    jest.restoreAllMocks();
  });

  describe("method createSettings()", () => {
    test("create settings for class functionality", () => {
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

  describe("method enable()", () => {
    test("notify to change one of thumbs when sliderContainer is clicked", () => {
      const spyOnClick = jest.spyOn(view.eventDispatcher, "notify");
      const evt = new Event("pointerup", {
        bubbles: true,
        cancelable: false, 
        composed: false
      });
      
      view.selectThumb(evt as PointerEvent);

      expect(spyOnClick).toHaveBeenCalledTimes(1);
    });

    test("should not notify when thumb or thumbSecond is clicked", () => {
      const spyOnClick = jest.spyOn(view.eventDispatcher, "notify");
      const evt = new Event("click", {
        bubbles: true
      })

      view.thumb.element.dispatchEvent(evt);
      view.thumbSecond.element.dispatchEvent(evt);

      expect(spyOnClick).toHaveBeenCalledTimes(0);
    });

    test("notify when thumb is moved", () => {
      const spyOnDragMove = jest.spyOn(view.eventDispatcher, "notify");

      view.thumbSecond.element.dispatchEvent(new Event("pointerdown"));
      document.dispatchEvent(new Event("pointermove"));

      expect(spyOnDragMove).toHaveBeenCalledTimes(1);
    });
  });

  describe("method selectThumb()", () => {
    test("should not notify subscribers if e.target is selectThumb or selectThumbSecond", () => {
      const spyOnSm = jest.spyOn(view.eventDispatcher, "notify");

      const evt = new MouseEvent("pointerup", {
        bubbles: true
      });
      view.thumb.element.dispatchEvent(evt);

      expect(spyOnSm).toBeCalledTimes(0);
    });
  });

  describe("method dragThumbStart()", () => {
    test("disable pointerdowm eventListener", () => {
      const newSet = {
        ...data,
        range: false,
      };
      view.init(newSet);
      view.thumb.element.dispatchEvent(new Event("pointerdown"));
      document.dispatchEvent(new Event("pointermove"));
      const spyOnDragStart = jest.spyOn(view, "dragThumbStart");

      view.thumb.element.dispatchEvent(new Event("pointerdowm"));

      expect(spyOnDragStart).toHaveBeenCalledTimes(0);
    });
  });

  describe("method dragThumbEnd()", () => {
    test("when pointer is up should end listening to pointermove", () => {
      const spyOnMoveListener = jest.spyOn(view.eventDispatcher, "notify");

      document.dispatchEvent(new Event("pointerup"));

      expect(spyOnMoveListener).toBeCalledTimes(0);
    });
  });

  describe("method stopListenDown()", () => {
    test("do not listen to thumbdown events when thumbmove", () => {
      const spyOnThumbDowm = jest.spyOn(view, "dragThumbStart");

      document.dispatchEvent(new Event("pointerdown"));

      expect(spyOnThumbDowm).toBeCalledTimes(0);
    });
  });

  describe("method render()", () => {
    test("init rendering view elements", () => {
      expect(view.sliderContainer).toBeDefined();
      expect(view.track).toBeDefined();
      expect(view.range).toBeDefined();
      expect(view.thumb).toBeDefined();
      expect(view.thumbSecond).toBeDefined();
      expect(view.scale).toBeDefined();
      expect(view.tooltipFirst).toBeDefined();
      expect(view.tooltipSecond).toBeDefined();
    });

    test("disable elements when !ifScale, !ifTooltip, !ifRange", () => {
      const newData = {
        scale: false,
        tooltip: false,
        range: false,
      };
      const updatedData = { ...initialData, ...newData };

      view.init(updatedData);

      expect(view.scale.classList.contains("disabled")).toBe(true);
      expect(view.tooltipFirst.element.classList.contains("disabled")).toBe(true);
    });
  });
});
