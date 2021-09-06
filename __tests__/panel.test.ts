/*
 * @jest-environment jsdom
 */

import { ConfigurationPanel } from "panel/panel";
import { SliderPresenter } from "mvp/presenter";
import { sliderData } from "mvp/data";

const container = document.createElement("div");
document.body.append(container);

const presenter = new SliderPresenter(container, sliderData);
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

    test("change of thumbFirst in presenter -> change thumbFirst in panel", () => {
      panel.presenter.fromPresenterThumbUpdate.notify(18);

      expect(panel.data.currentFirst).toBe(18);
    });

    test("change of thumbSecond in presenter -> change thumbSecond in panel", () => {
      panel.presenter.fromPresenterThumbSecondUpdate.notify(53);

      expect(panel.data.currentSecond).toBe(53);
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

    describe("should assign changingObject", () => {
      test("case currentFirst", () => {
        const elm = document.createElement("input");
        elm.setAttribute("name", "currentFirst");
        elm.setAttribute("type", "number");
        elm.setAttribute("value", "33%");

        const evt = {
          ...new Event("change"),
          target: elm,
        };

        panel.changePanel(evt);

        expect(panel.presenter.changingObject).toBe(panel.presenter.view.sliderThumb.element);
      });

      test("case currentSecond", () => {
        const elm = document.createElement("input");
        elm.setAttribute("name", "currentSecond");
        elm.setAttribute("type", "number");
        elm.setAttribute("value", "66%");

        const evt = {
          ...new Event("change"),
          target: elm,
        };

        panel.changePanel(evt);

        expect(panel.presenter.changingObject).toBe(panel.presenter.view.sliderThumbSecond.element);
      });
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
const presenterS = new SliderPresenter(container, newData);
const panelS = new ConfigurationPanel(container, presenterS);
describe("Panel for single slider", () => {
  test("should disable input for currentSecond", () => {
    const currentSecondInput = <HTMLInputElement>(
      panelS.panelContainer.querySelector('input[name="currentSecond"]')
    );

    expect(currentSecondInput.disabled).toBe(true);
  });
});
