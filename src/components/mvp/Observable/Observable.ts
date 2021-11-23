import { TFunc, TFuncArg } from "Utils/types";
import IObservable from "Interfaces/IObservable";

export default class Observable implements IObservable {
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
};
