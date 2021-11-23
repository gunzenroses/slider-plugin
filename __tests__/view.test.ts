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

  describe("method init()", () => {
    test("set passed in data as settings", () => {
      expect(view.settings).toEqual(data);
    });
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
      expect(view.settings.stepPerDiv).toBeTruthy();
      expect(view.settings.max).toBeTruthy();
      expect(view.settings.min).toBeDefined();
    });
  });

  describe("method enable()", () => {
    test("notify 'selectThumb' subscribers when sliderContainer is clicked", () => {
      const spyOnClick = jest.spyOn(view.eventDispatcher, "notify");

      view.sliderContainer.dispatchEvent(new Event("pointerdown"));
      view.sliderContainer.dispatchEvent(new Event("pointerup"));

      expect(spyOnClick).toHaveBeenCalledTimes(1);
    });

    test("should not notify 'selectThumb' subscribers when thumb or thumbSecond is clicked", () => {
      const spyOnClick = jest.spyOn(view.eventDispatcher, "notify");

      view.thumb.element.dispatchEvent(new Event("click"));
      view.thumbSecond.element.dispatchEvent(new Event("click"));

      expect(spyOnClick).toHaveBeenCalledTimes(0);
    });

    test("notify 'dragThumb' subscribers when thumb is moved", () => {
      const spyOnDragMove = jest.spyOn(view.eventDispatcher, "notify");

      view.thumbSecond.element.dispatchEvent(new Event("pointerdown"));
      document.dispatchEvent(new Event("pointermove"));

      expect(spyOnDragMove).toHaveBeenCalledTimes(1);
    });
  });

  describe("method selectThumb()", () => {
    test("should not notify subscribers if e.target is selectThumb or selectThumbSecond", () => {
      const evt = new Event("pointerup") as PointerEvent;
      view.thumb.element.dispatchEvent(evt);
      const spyOnSm = jest.spyOn(view.eventDispatcher, "notify");

      view.selectThumb(evt);

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

  describe("method change()", () => {
    test("update styles for Thumb, Range and Tooltip when (selectObject === thumb)", () => {
      const obj = view.thumb.element;
      const num = 7;

      view.change(obj, num);

      expect(view.thumb.element.style.left).toBe(num + "%");
      expect(view.range.element.style.left).toBe(num + "%");
      expect(parseInt(view.tooltipFirst.element.innerText)).toBe(num);
    });

    test("update styles for Thumb, Range and Tooltip when (selectObject === thumbSecond)", () => {
      const obj = view.thumbSecond.element;
      const num = 11;

      view.change(obj, num);

      expect(view.thumbSecond.element.style.left).toBe(num + "%");
      expect(view.range.element.style.right).toBe(100 - num + "%");
      expect(parseInt(view.tooltipSecond.element.innerText)).toBe(num);
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