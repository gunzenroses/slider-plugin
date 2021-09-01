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
      const spyRender = jest.spyOn(panel, "render");

      panel.init();

      expect(spyRender).toHaveBeenCalledTimes(1);
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
      panel.init();
      panel.presenter.fromPresenterThumbUpdate.notify();

      expect(panel.data.currentFirst).toBe(panel.presenter.data.currentFirst);
    });

    test("change of thumbSecond in presenter should thumbSecond data in panel", () => {
      panel.init();
      panel.presenter.fromPresenterThumbSecondUpdate.notify();

      expect(panel.data.currentSecond).toBe(panel.presenter.data.currentSecond);
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
      const event = new Event("change");
      trg.value = "";

      trg.dispatchEvent(event);
      panel.changePanel(event);
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
        const evt = {
          ...new Event("change"),
          target: trg,
        };

        panel.changePanel(evt);

        expect(panel.validation.invalidities).toContain("Should be a number");
      });

      test("add error-message when value > max", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='currentSecond']"
        ) as HTMLInputElement;
        trg.setAttribute("max", "100");
        trg.value = "120";
        const evt = {
          ...new Event("change"),
          target: trg,
        };

        panel.changePanel(evt);

        expect(panel.validation.invalidities).toContain("Number should be maximum 100");
      });

      test("add error-message when value < min", () => {
        const trg: HTMLInputElement = panel.panelContainer.querySelector(
          "input[name='step']"
        ) as HTMLInputElement;
        trg.min = "1";
        trg.value = "0";
        const evt = {
          ...new Event("change"),
          target: trg,
        };

        panel.changePanel(evt);

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
      const evt = {
        ...new Event("change"),
        target: trg,
      };

      panel.changePanel(evt);

      expect(panel.validation.invalidities).toContain("Number should be multiple of 3");
    });
  });

  describe("method updatePanel()", () => {
    test("should update data", () => {
      presenter.data.step = 8;
      presenter.data.min = 10;
      presenter.data.max = 100;

      panel.updatePanel();

      expect(parseInt(panel.data.step)).toBe(presenter.data.step);
      expect(parseInt(panel.data.min)).toBe(presenter.data.min);
      expect(parseInt(panel.data.max)).toBe(presenter.data.max);
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
    const currentSecondInput = <HTMLInputElement>(
      panelS.panelContainer.querySelector('input[name="currentSecond"]')
    );

    expect(currentSecondInput.disabled).toBe(true);
  });
});
