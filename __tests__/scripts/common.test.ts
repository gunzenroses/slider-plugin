import { initialData } from "src/components/initialData";
import {
  applyRestrictions,
  applyStepOnPercents,
  applyStepOnValue,
  commonDivider,
  findPosition,
} from "Utils/common";

describe("applyStepOnPercents()", () => {
  test("casual case for 'value' and 'step'", () => {
    const val = 38;
    const step = 3;

    const back: number = applyStepOnPercents(val, step);
    const num: number = back % step;

    expect(num).toBe(0);
  });

  test("case when 'value' = 100", () => {
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

describe("applyStepOnValue", () => {
  const data = {
    ...initialData,
    max: 122,
    min: 8,
    step: 3,
  };

  test("return 'min' when (value - min) <= 0", () => {
    data.max = 100;
    const value = 6;

    const rtn = applyStepOnValue(value, data);

    expect(rtn).toBe(data.min);
  });

  test("return 'max' when ('value' > 'max')", () => {
    const value = 130;

    const rtn = applyStepOnValue(value, data);

    expect(rtn).toBe(data.max);
  });

  describe("when 'value' % 'step' != 0", () => {
    test("return smaller closest stepMatching number", () => {
      const { min, step } = data;
      const value = 30;
      const less = Math.floor((value - min) / step);
      const exp = less * step + min;

      const rtn = applyStepOnValue(value, data);

      expect(rtn).toBe(exp);
    });

    test("return closest bigger stepMatching number", () => {
      const { min, step } = data;
      const value = 31;
      const less = Math.ceil((value - min) / step);
      const exp = less * step + min;

      const rtn = applyStepOnValue(value, data);

      expect(rtn).toBe(exp);
    });

    test("return 'max' when closest stepMatching number is bigger than 'max'", () => {
      data.max = 31;
      const value = 31;

      const rtn = applyStepOnValue(value, data);

      expect(rtn).toBe(data.max);
    });

    test("return 'max' when  closest stepMatching number is 'max'", () => {
      data.step = 3;
      data.min = 1;
      data.max = 100;
      const value = 99;

      const rtn = applyStepOnValue(value, data);

      expect(rtn).toBe(data.max);
    });
  });
});

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

describe("findPosition()", () => {
  const element = document.createElement("HTMLElements");
  element.style.left = "100px";
  element.style.right = "100px";

  const element2 = document.createElement("div");

  const container = 400;

  describe("for horizontal slider", () => {
    test("thumb element", () => {
      const pos = findPosition(element, true, container);

      expect(pos).toBeDefined();
    });

    test("thumb element without style", () => {
      const pos = findPosition(element2, true, container);

      expect(pos).toBeDefined();
    });
  });

  describe("for vertical slider", () => {
    test("thumb element", () => {
      const pos = findPosition(element, false, container);

      expect(pos).toBeDefined();
    });

    test("thumb element without style", () => {
      const pos = findPosition(element2, false, container);

      expect(pos).toBeDefined();
    });
  });
});
