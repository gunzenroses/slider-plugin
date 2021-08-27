/**
 * @jest-environment jsdom
 */

import { IModel, SliderModel } from "mvp/model";
import { sliderData } from "mvp/data";
import { TSettings } from "utils/types";
import adjustValue from "helpers/adjustData";

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
    test("should update step, min and max data in model", () => {
      const step = 10;
      const min = 2;
      const max = 200;

      model.setData("step", step);
      model.setData("min", min);
      model.setData("max", max);

      expect(model.getData()).toHaveProperty("step", step);
      expect(model.getData()).toHaveProperty("min", min);
      expect(model.getData()).toHaveProperty("max", max);
    });

    test("should update currentFirst and currentSecond data in model", () => {
      const currentFirst = adjustValue("currentFirst", 11, model.getData());
      const currentSecond = adjustValue("currentSecond", 35, model.getData());

      model.setData("currentFirst", currentFirst);
      model.setData("currentSecond", currentSecond);

      expect(model.getData()).toHaveProperty("currentFirst", currentFirst);
      expect(model.getData()).toHaveProperty("currentSecond", currentSecond);
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

    test("have valid properties(min, max, range, currentFirst, currentSecond, step, orientation, tooltip, scale)", () => {
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

    test("should make currentThumbSecond multiple of step, when range=true", () => {
      const newCF = { name: "currentSecond", data: 35 };
      const step = model.getData().step;
      const multiple = Math.trunc((newCF.data / step) * step);

      model.setData("range", true);
      model.setData(newCF.name, newCF.data);

      expect(model.getData().currentSecond).toBe(multiple);
    });

    test("should make currentThumbSecond=max, when range=false", () => {
      model.setData("range", false);

      expect(model.getData().currentSecond).toBe(model.getData().max);
    });
  });

  describe("method getContainerId()", () => {
    test("return string with containerId passed into constructor", () => {
      expect(model.getContainer()).toEqual(container);
    });
  });

  describe("method changeThumb()", () => {
    const val = 3;

    test("should be called", () => {
      const spyChangeThumb = jest.spyOn(model, "changeThumb");

      model.changeThumb(val);

      expect(spyChangeThumb).toBeCalledTimes(1);
    });

    test("should change data.currentFirst", () => {
      model.changeThumb(val);

      expect(model.getData()).toHaveProperty("currentFirst", val);
    });
  });

  describe("method changeThumbSecond()", () => {
    const num = 5;

    test("should be called", () => {
      const spyChangeThumbSecond = jest.spyOn(model, "changeThumbSecond");

      model.changeThumbSecond(num);

      expect(spyChangeThumbSecond).toBeCalledTimes(1);
    });

    test("should change the value of data.CurrentSecond", () => {
      model.changeThumbSecond(num);

      expect(model.getData()).toHaveProperty("currentSecond", num);
    });
  });
});
