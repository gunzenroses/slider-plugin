/*
 * @jest-environment jsdom
 */

import { ConfigurationPanel } from "panel/panel";
import { SliderPresenter } from "mvp/presenter";
import { SliderModel } from "mvp/model";
import { SliderView } from "mvp/view";
import { sliderData } from "mvp/data";

const container = document.createElement("div");
document.body.append(container);

const model = new SliderModel(container, sliderData);
const view = new SliderView(container);
const presenter = new SliderPresenter(model, view);
const panel = new ConfigurationPanel(container, presenter);

describe("Panel for double slider", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("method init()", () => {
    test("should create panel items", () => {
      expect(panel.checkboxes).toBeTruthy();
      expect(panel.orientationInput).toBeTruthy();
      expect(panel.numberInputs).toBeTruthy();
      expect(panel.minInput).toBeTruthy();
      expect(panel.maxInput).toBeTruthy();
      expect(panel.stepInput).toBeTruthy();
      expect(panel.currentFirstInput).toBeTruthy();
      expect(panel.currentSecondInput).toBeTruthy();
    });
  });

  describe("handlers for events", () => {
    test("changes in presenter should trigger panel to update", () => {
      const spyOnUpdatePanel = jest.spyOn(panel, "updatePanel").mockImplementation();

      panel.init();
      panel.presenter.fromPresenterUpdate.notify();

      expect(spyOnUpdatePanel).toHaveBeenCalledTimes(1);
    });

    test("change of thumb in presenter should update data in panel", () => {
      const spyOnUpdateThumb = jest.spyOn(panel, "updateThumb").mockImplementation();

      panel.init();
      panel.presenter.fromPresenterThumbUpdate.notify();

      expect(spyOnUpdateThumb).toHaveBeenCalledTimes(1);
    });

    test("change of thumbSecond in presenter should thumbSecond data in panel", () => {
      const spyOnUpdateThumbSecond = jest.spyOn(panel, "updateThumbSecond").mockImplementation();

      panel.init();
      panel.presenter.fromPresenterThumbSecondUpdate.notify();

      expect(spyOnUpdateThumbSecond).toHaveBeenCalledTimes(1);
    });
  });

  describe("method changePanel()", () => {
    test("should update data", () => {
      const spyPresenter = jest.spyOn(panel.presenter, "modelData").mockImplementation();
      const trg = panel.panelContainer.querySelector("input[name='range']") as HTMLInputElement;
      const evt = {
        ...new Event("click"),
        target: trg,
      };

      panel.changePanel(evt);

      expect(spyPresenter).toHaveBeenCalledTimes(1);
    });

    test("should use setTimeout to update data with type 'number'", async () => {
      jest.useFakeTimers();
      const spyPresenter = jest.spyOn(panel.presenter, "modelData").mockImplementation();
      const trg: HTMLInputElement = panel.panelContainer.querySelector(
        "input[name='max']"
      ) as HTMLInputElement;
      trg.value = "";

      trg.dispatchEvent(new Event("change"));
      jest.runAllTimers();

      expect(spyPresenter).toHaveBeenCalledTimes(1);
    });

    describe("should validate data for input[type='number']", () => {
      beforeEach(() => {
        jest.useFakeTimers();
        jest.runAllTimers();
        panel.validation.invalidities = [];
      });

      test("return false when input.value=''", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='max']"
        ) as HTMLInputElement;
        trg.value = "";

        trg.dispatchEvent(new Event("change"));

        expect(trg.checkValidity()).toBeFalsy();
      });

      test("return nothing when input has a proper value", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='max']"
        ) as HTMLInputElement;
        trg.value = "200";

        trg.dispatchEvent(new Event("change"));

        expect(panel.validation.invalidities).toEqual([]);
      });

      test("add error-message when value is not a number", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='max']"
        ) as HTMLInputElement;
        trg.setAttribute("max", "100");
        trg.value = "Cat";

        trg.dispatchEvent(new Event("change"));

        expect(panel.validation.invalidities).toContain("Should be a number");
      });

      test("add error-message when value > max", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='currentSecond']"
        ) as HTMLInputElement;
        trg.setAttribute("max", "100");
        trg.value = "120";

        trg.dispatchEvent(new Event("change"));

        expect(panel.validation.invalidities).toContain("Number should be maximum 100");
      });

      test("add error-message when value < min", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='step']"
        ) as HTMLInputElement;
        trg.min = "1";
        trg.value = "0";

        trg.dispatchEvent(new Event("change"));

        expect(panel.validation.invalidities).toContain("Number should be minimum 1");
      });

      test("add error-message when stepMismatch and min>0", () => {
        const trg: HTMLInputElement = <HTMLInputElement>(
          panel.panelContainer.querySelector("input[name='currentFirst']")
        );
        trg.setAttribute("min", "10");
        trg.setAttribute("step", "8");
        trg.value = "32";

        trg.dispatchEvent(new Event("change", { bubbles: true }));

        expect(panel.validation.invalidities).toContain("Number should be: 10 + multiple of 8");
      });
    });

    test("add error-message when stepMismatch and min=0", () => {
      const trg: HTMLInputElement = <HTMLInputElement>(
        panel.panelContainer.querySelector("input[name='currentSecond']")
      );
      trg.setAttribute("min", "0");
      trg.setAttribute("step", "3");
      trg.value = "31";

      trg.dispatchEvent(new Event("change"));

      expect(panel.validation.invalidities).toContain("Number should be multiple of 3");
    });
  });

  describe("method updatePanel()", () => {
    test("should update data", () => {
      panel.data.step = 8;
      panel.data.min = 10;
      panel.data.max = 100;
      panel.updatePanel();

      expect(parseInt(panel.stepInput.value)).toBe(panel.data.step);
      expect(parseInt(panel.minInput.value)).toBe(panel.data.min);
      expect(parseInt(panel.maxInput.value)).toBe(panel.data.max);
      expect(parseInt(panel.currentFirstInput.min)).toBe(panel.data.min);
      expect(parseInt(panel.currentFirstInput.value)).toBe(panel.data.currentFirst);
      expect(parseInt(panel.currentFirstInput.step)).toBe(panel.data.step);
      expect(parseInt(panel.currentSecondInput.min)).toBe(panel.data.currentFirst);
      expect(parseInt(panel.currentSecondInput.value)).toBe(panel.data.currentSecond);
      expect(parseInt(panel.currentSecondInput.step)).toBe(panel.data.step);
    });
  });
});

const newData = { ...sliderData, range: false, tooltip: false, scale: false };
const modelS = new SliderModel(container, newData);
const viewS = new SliderView(container);
const presenterS = new SliderPresenter(modelS, viewS);
const panelS = new ConfigurationPanel(container, presenterS);
describe("Panel for single slider", () => {
  test("should disable input for currentSecond", () => {
    expect(panelS.currentSecondInput.disabled).toBe(true);
  });
});
