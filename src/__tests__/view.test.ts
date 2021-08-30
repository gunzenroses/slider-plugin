/**
 * @jest-environment jsdom
 */
import { IView, SliderView } from "mvp/view";
import { sliderData } from "mvp/data";

describe("class SliderView", () => {
  const data = sliderData;
  const container = document.createElement("div");
  document.body.append(container);
  let view: IView;

  beforeEach(() => {
    container.innerHTML = "";
    view = new SliderView(container);
    view.init(data);
    jest.restoreAllMocks();
  });

  describe("method init()", () => {
    test("set passed in data as settings", () => {
      expect(view.settings).toEqual(data);
    });
  });

  describe("method createChildren()", () => {
    test("create children (variables) for class functionality", () => {
      expect(view.ifHorizontal).toBeDefined();
      expect(view.ifRange).toBeDefined();
      expect(view.ifTooltip).toBeDefined();
      expect(view.ifScale).toBeDefined();
      expect(view.currentFirstInPercents).toBeTruthy();
      expect(view.currentSecondInPercents).toBeTruthy();
      expect(view.stepValue).toBeTruthy();
      expect(view.stepPerDiv).toBeTruthy();
      expect(view.maxValue).toBeTruthy();
      expect(view.minValue).toBeDefined();
    });
  });

  describe("method enable()", () => {
    test("notify fromViewSelectThumb subscribers when sliderContainer is clicked", () => {
      const spyOnClick = jest.spyOn(view.fromViewSelectThumb, "notify");

      view.sliderContainer.dispatchEvent(new Event("click"));

      expect(spyOnClick).toHaveBeenCalledTimes(1);
    });

    test('should not activate "fromViewSelectThumb" when sliderThumb or sliderThumbSecond is clicked', () => {
      const spyOnClick = jest.spyOn(view.fromViewSelectThumb, "notify");

      view.sliderThumb.element.dispatchEvent(new Event("click"));
      view.sliderThumbSecond.element.dispatchEvent(new Event("click"));

      expect(spyOnClick).toHaveBeenCalledTimes(0);
    });

    test("define dragObject when sliderThumb is started to be dragged", () => {
      view.sliderThumb.element.dispatchEvent(new Event("pointerdown"));

      expect(view.dragObject).toBeDefined();
    });

    test("define dragObject when sliderThumbSecond is started to be dragged", () => {
      view.settings.range = true;

      view.sliderThumbSecond.element.dispatchEvent(new Event("pointerdown"));

      expect(view.dragObject).toBeDefined();
    });

    test("notify fromViewDragThumb subscribers when thumb is moved", () => {
      const spyOnDragMove = jest.spyOn(view.fromViewDragThumb, "notify");

      view.sliderThumbSecond.element.dispatchEvent(new Event("pointerdown"));
      document.dispatchEvent(new Event("pointermove"));

      expect(spyOnDragMove).toHaveBeenCalledTimes(1);
    });
  });

  describe("method dragThumbEnd()", () => {
    test("when pointer is up should end listening to pointermove", () => {
      const spyOnMoveListener = jest.spyOn(view.fromViewDragThumb, "notify");

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
    test("update styles for Thumb, Range and Tooltip when (selectObject === sliderThumb)", () => {
      const obj = view.sliderThumb.element;
      const num = 7;

      view.change(obj, num);

      expect(view.sliderThumb.element.style.left).toBe(num + "%");
      expect(view.sliderRange.element.style.left).toBe(num + "%");
      expect(parseInt(view.tooltipFirst.element.innerText)).toBe(num);
    });

    test("update styles for Thumb, Range and Tooltip when (selectObject === sliderThumbSecond)", () => {
      const obj = view.sliderThumbSecond.element;
      const num = 11;

      view.change(obj, num);

      expect(view.sliderThumbSecond.element.style.left).toBe(num + "%");
      expect(view.sliderRange.element.style.right).toBe(100 - num + "%");
      expect(parseInt(view.tooltipSecond.element.innerText)).toBe(num);
    });
  });

  describe("method render()", () => {
    test("init rendering of view elements", () => {
      expect(view.sliderContainer).toBeDefined();
      expect(view.sliderTrack).toBeDefined();
      expect(view.sliderRange).toBeDefined();
      expect(view.sliderThumb).toBeDefined();
      expect(view.sliderThumbSecond).toBeDefined();
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
      const updatedData = { ...sliderData, ...newData };

      view.init(updatedData);

      expect(view.scale.classList.contains("disabled")).toBe(true);
      expect(view.tooltipFirst.element.classList.contains("disabled")).toBe(true);
    });
  });

  describe("method dragThumbStart()", () => {
    test("when pointerdowm determine view.dragObject = e.target", () => {
      view.dragThumbEnd();
      view.sliderThumb.element.dispatchEvent(new Event("pointerdown"));

      expect(view.dragObject).toBe(view.sliderThumb.element);
    });

    test("disable pointerdowm eventListener", () => {
      const newSet = {
        ...data,
        range: false,
      };
      view.init(newSet);
      view.sliderThumb.element.dispatchEvent(new Event("pointerdown"));
      document.dispatchEvent(new Event("pointermove"));
      const spyOnDragStart = jest.spyOn(view, "dragThumbStart");

      view.sliderThumb.element.dispatchEvent(new Event("pointerdowm"));

      expect(spyOnDragStart).toHaveBeenCalledTimes(0);
    });
  });
});
