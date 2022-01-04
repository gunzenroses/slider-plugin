import { TListener, TListenerArg, TListenerArr } from "Utils/types";
import IObservable from "Interfaces/IObservable";

export default class Observable implements IObservable {
  private listeners: TListenerArr = {};

  add(eventKey: string, listener: TListener): void {
    if (this.listeners[eventKey]) {
      this.listeners[eventKey].push(listener);
    } else {
      this.listeners[eventKey] = [listener];
    }
  }

  notify(eventKey: string, args?: TListenerArg): void {
    if (this.listeners[eventKey]) {
      if (typeof args === "undefined") {
        this.listeners[eventKey].forEach((listener) => listener());
      } else {
        this.listeners[eventKey].forEach((listener) => listener(args));
      }
    }
  }
}
