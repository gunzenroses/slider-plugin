/*
 * @jest-environment jsdom
 */

import checkValidity from "Helpers/checkValidity";

const container = document.createElement("div");
document.body.append(container);

const item = document.createElement("input");
item.type = "number";

describe("helpers: class checkValidity", () => {
  test("return false when input.value=''", () => {
    item.value = "";

    const checkItem = new checkValidity(item, container);

    expect(checkItem.checkValidity()).toBeFalsy();
  });

  test("add error-message when value is not a number", () => {
    item.value = "cat";

    const checkItem = new checkValidity(item, container);

    expect(checkItem.invalidities).toContain("Should be a number");
  });

  test("return nothing when input has a proper value", () => {
    item.value = "15";
    item.step = "5";
    item.min = "0";
    item.max = "30";

    const checkItem = new checkValidity(item, container);

    expect(checkItem.invalidities).toEqual([]);
  });

  test("add error-message when value > item", () => {
    item.value = "31";
    item.max = "30";

    const checkItem = new checkValidity(item, container);

    expect(checkItem.invalidities).toContain("Number should be maximum 30");
  });

  test("add error-message when stepMismatch and min=0", () => {
    item.min = "0";
    item.step = "4";
    item.value = "11";
    item.name = "from";

    const checkItem = new checkValidity(item, container);

    expect(checkItem.invalidities).toContain("Number should be multiple of 4");
  });

  test("add error-message when stepMismatch and min>0", () => {
    item.min = "10";
    item.step = "8";
    item.value = "25";
    item.name = "from"
    
    const checkItem = new checkValidity(item, container);

    expect(checkItem.invalidities).toContain("Number should be: 10 + multiple of 8");
  });

  test("add error-message when value < min", () => {
    item.min = "1";
    item.value = "0";

    const checkItem = new checkValidity(item, container);

    expect(checkItem.invalidities).toContain("Number should be minimum 1");
  });
});
