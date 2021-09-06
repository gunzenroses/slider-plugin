import { TFunc, TFuncArg } from "utils/types";

interface ISender {
  add(listener: TFunc): void;
  remove(listener: TFunc): void;
  notify(args?: TFuncArg): void;
}

class EventDispatcher implements ISender {
  private listeners: Array<TFunc> = [];

  add(listener: TFunc): void {
    this.listeners.push(listener);
  }

  remove(listener: TFunc): void {
    const index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }

  get(): Array<TFunc> {
    return this.listeners;
  }

  notify(args?: Event | number): void {
    this.listeners.forEach((listener) => listener(args as TFuncArg));
  }
}

export { ISender, EventDispatcher };
