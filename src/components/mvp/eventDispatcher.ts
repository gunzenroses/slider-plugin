import { TFunc, TFuncArg } from "utils/types";

interface ISender {
  add(listener: TFunc): void;
  remove(listener: TFunc): void;
  notify(args: number | Event): void;
}

class EventDispatcher implements ISender {
  listeners: Array<TFunc> = [];

  add(listener: TFunc): void {
    this.listeners.push(listener);
  }

  remove(listener: TFunc): void {
    const index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }

  notify(args?: Event | number): void {
    this.listeners.forEach((listener) => listener(args as TFuncArg));
  }
}

export { ISender, EventDispatcher };
