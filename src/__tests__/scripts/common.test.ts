import { applyRestrictions, applyStepOnPercents, commonDivider, findPosition } from "utils/common";

describe("commonDivider", () => {
  test("basicNum > changeNum", () => {
    const bn = 20;
    const cn = 8;

    const newNum = commonDivider(bn, cn);

    expect(newNum).toBe(10);
  });

  test("bacisNum < changeNum", () => {
    const bn = 20;
    const cn = 50;

    const newNum = commonDivider(bn, cn);

    expect(newNum).toBe(cn);
  });
});

describe("applyStepOnPercents()", () => {
  test("casual case for value and step", () => {
    const val = 38;
    const step = 3;

    const back: number = applyStepOnPercents(val, step);
    const num: number = back % step;

    expect(num).toBe(0);
  });

  test("case when value = 100", () => {
    const val = 100;
    const step = 3;

    const back: number = applyStepOnPercents(val, step);

    expect(back).toBe(100);
  });
});

describe("applyRestrictions", () => {
  test("restrict all numbers between 0 and 100", () => {
    const numArr = [102, 11, -2];

    const newArr = numArr.map((item) => applyRestrictions(item));

    expect(newArr[0]).toBe(100);
    expect(newArr[1]).toBe(11);
    expect(newArr[2]).toBe(0);
  });
});

describe("findPosition()", () => {
  const element = {
    style: {
      left: "100px",
      bottom: "100px",
    },
  } as HTMLElement;

  const container = 400;

  test("find position of thumb element for horizontal slider", () => {
    const pos = findPosition(element, true, container);

    expect(pos).toBeDefined();
  });

  test("find position of thumb element for vertical slider", () => {
    const pos = findPosition(element, false, container);

    expect(pos).toBeDefined();
  });
});
