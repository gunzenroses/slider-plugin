/**
 * @jest-environment jsdom
 */

import { SliderView } from "mvp/view";
import { sliderData } from "mvp/data";
import { mergeData } from "utils/common";

let data = sliderData;
let containerId = "container1";

let initialContainer = document.createElement("div");
initialContainer.id = containerId;
document.body.append(initialContainer);

describe("class SliderView", () => {
  let view = new SliderView(containerId);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("method init()", () => {
    view.init(data);
    test("set passed in data as settings", () => {
      expect(view.settings).toEqual(data);
    });
  });

  describe("method createChildren()", () => {
    test("create children (variables) for class functionality", () => {
      expect(view.ifHorizontal).toBeDefined;
      expect(view.ifRange).toBeDefined;
      expect(view.ifTooltip).toBeDefined;
      expect(view.ifScale).toBeDefined;
      expect(view.currentFirstInPercents).toBeTruthy;
      expect(view.currentSecondInPercents).toBeTruthy;
      expect(view.stepValue).toBeTruthy;
      expect(view.stepPerDiv).toBeTruthy;
      expect(view.maxValue).toBeTruthy;
      expect(view.minValue).toBeTruthy;
    });
  });

  describe("method enable()", () => {
    test("notify fromViewSelectThumb subscribers when sliderContainer is clicked", () => {
      let spyOnClick = jest.spyOn(view.fromViewSelectThumb, "notify");

      view.sliderContainer.dispatchEvent(new Event("click"));

      expect(spyOnClick).toHaveBeenCalledTimes(1);
    });

    test('should not activate "fromViewSelectThumb" when sliderThumb or sliderThumbSecond is clicked', () => {
      let spyOnClick = jest.spyOn(view.fromViewSelectThumb, "notify");

      view.sliderThumb.dispatchEvent(new Event("click"));
      view.sliderThumbSecond.dispatchEvent(new Event("click"));

      expect(spyOnClick).toHaveBeenCalledTimes(0);
    });

    test("define dragObject when sliderThumb is started to be dragged", () => {
      view.sliderThumb.dispatchEvent(new Event("pointerdown"));

      expect(view.dragObject).toBeDefined;
    });

    test("define dragObject when sliderThumbSecond is started to be dragged", () => {
      view.settings.range = true;

      view.sliderThumbSecond.dispatchEvent(new Event("pointerdown"));

      expect(view.dragObject).toBeDefined;
    });

    test("notify fromViewDragThumb subscribers when thumb is moved", () => {
      let spyOnDragMove = jest.spyOn(view.fromViewDragThumb, "notify");

      view.sliderThumbSecond.dispatchEvent(new Event("pointerdown"));
      document.dispatchEvent(new Event("pointermove"));

      expect(spyOnDragMove).toHaveBeenCalledTimes(1);
    });
  });

  describe("method change()", () => {
    test("update styles for Thumb, Range and Tooltip when (selectObject === sliderThumb)", () => {
      let obj = view.sliderThumb;
      let num = 7;

      view.сhange(obj, num);

      expect(view.sliderThumb.style.left).toBe(num + "%");
      expect(view.sliderRange.style.left).toBe(num + "%");
      expect(parseInt(view.tooltipFirst.innerText)).toBe(num);
    });

    test("update styles for Thumb, Range and Tooltip when (selectObject === sliderThumbSecond)", () => {
      let obj = view.sliderThumbSecond;
      let num = 11;

      view.сhange(obj, num);

      expect(view.sliderThumbSecond.style.left).toBe(num + "%");
      expect(view.sliderRange.style.right).toBe(100 - num + "%");
      expect(parseInt(view.tooltipSecond.innerText)).toBe(num);
    });
  });

  describe("method render()", () => {
    test("init rendering of view elements", () => {
      expect(view.sliderContainer).toBeDefined;
      expect(view.sliderTrack).toBeDefined;
      expect(view.sliderRange).toBeDefined;
      expect(view.sliderThumb).toBeDefined;
      expect(view.sliderThumbSecond).toBeDefined;
      expect(view.scale).toBeDefined;
      expect(view.tooltipFirst).toBeDefined;
      expect(view.tooltipSecond).toBeDefined;
    });

    test("disable elements when !ifScale, !ifTooltip, !ifRange", () => {
      let newData = {
        scale: false,
        tooltip: false,
        range: false,
      };
      let updatedData = mergeData(sliderData, newData);

      view.init(updatedData);
      
      expect(view.scale.classList.contains("disabled")).toBe(true);
      expect(view.tooltipSecond.classList.contains("disabled")).toBe(true);
    });
  });
});
