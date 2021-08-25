import { EventDispatcher } from "mvp/eventDispatcher";
import { TFuncArg } from "utils/types";

class Listener {
  msg: TFuncArg | undefined;

  constructor(msg?: TFuncArg) {
    this.msg = msg;
  }

  setHandler = this.set.bind(this);

  set(msg?: TFuncArg) {
    this.msg = msg;
  }
}

describe("EventDispatcher", () => {
  const ed = new EventDispatcher();
  const listener = new Listener(1);

  test("method add(): add listener to listeners", () => {
    ed.add(listener.setHandler);

    expect(ed.listeners.length).toBe(1);
  });

  test("method notify(): pass arguments when it notifies listeners", () => {
    const message = 12;

    ed.notify(message);

    expect(listener.msg).toBe(message);
  });

  test("method remove(): remove listener from listeners", () => {
    ed.remove(listener.setHandler);

    expect(ed.listeners.length).toBe(0);
  });
});
