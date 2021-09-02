/**
 * @jest-environment jsdom
 */

import { IModel, SliderModel } from "mvp/model";
import { sliderData } from "mvp/data";
import { TSettings } from "utils/types";
import adjustValue from "helpers/adjustValue";

describe("class SliderModel", () => {
  let container: HTMLElement;
  let data: TSettings;
  let model: IModel;

  beforeEach(() => {
    container = document.createElement("div");
    data = sliderData;
    model = new SliderModel(container, data);
    jest.restoreAllMocks();
  });

  describe("method setData", () => {
    test("should update data in model", () => {
      const min = adjustValue("min", 2, model.getData());
      const max = adjustValue("max", 130, model.getData());
      const step = adjustValue("step", 2, model.getData());

      model.setData("step", step);
      model.setData("min", min);
      model.setData("max", max);

      expect(model.getData()).toHaveProperty("step", step);
      expect(model.getData()).toHaveProperty("min", min);
      expect(model.getData()).toHaveProperty("max", max);
    });

    test("should change data.currentFirst", () => {
      const val = 3;

      model.setData("currentFirst", val);

      expect(model.getData()).toHaveProperty("currentFirst", val);
    });

    test("should change data.CurrentSecond", () => {
      const num = 5;

      model.setData("currentSecond", num);

      expect(model.getData()).toHaveProperty("currentSecond", num);
    });
  });

  describe("method getContainerId", () => {
    test("should return id, which was passed to constructor", () => {
      expect(model.getContainer()).toEqual(container);
    });
  });

  describe("method getData()", () => {
    test("return object which were passed into constructor data", () => {
      //assertion
      expect(model.getData()).toEqual(data);
    });

    test("have valid properties('min', 'max', 'range', 'currentFirst', 'currentSecond', 'step', 'orientation', 'tooltip', 'scale')", () => {
      //assertion
      expect(model.getData()).toHaveProperty("min");
      expect(model.getData()).toHaveProperty("max");
      expect(model.getData()).toHaveProperty("range");
      expect(model.getData()).toHaveProperty("currentFirst");
      expect(model.getData()).toHaveProperty("currentSecond");
      expect(model.getData()).toHaveProperty("step");
      expect(model.getData()).toHaveProperty("orientation");
      expect(model.getData()).toHaveProperty("tooltip");
      expect(model.getData()).toHaveProperty("scale");
    });
  });

  describe("method updateCurrentsWithStep()", () => {
    test("should make currentThumb multiple of step", () => {
      const newCF = { name: "currentFirst", data: 26 };
      const step = model.getData().step;
      const multiple = Math.trunc((newCF.data / step) * step);

      model.setData(newCF.name, newCF.data);

      expect(model.getData().currentFirst).toBe(multiple);
    });

    test("should make currentThumbSecond multiple of 'step', when 'range'=true", () => {
      const newCF = { name: "currentSecond", data: 35 };
      const step = model.getData().step;
      const multiple = Math.trunc((newCF.data / step) * step);

      model.setData("range", true);
      model.setData(newCF.name, newCF.data);

      expect(model.getData().currentSecond).toBe(multiple);
    });

    test("should make 'currentThumbSecond'='max', when 'range'=false", () => {
      model.setData("range", false);

      expect(model.getData().currentSecond).toBe(model.getData().max);
    });
  });

  describe("method getContainerId()", () => {
    test("return string with containerId passed into constructor", () => {
      expect(model.getContainer()).toEqual(container);
    });
  });
});
