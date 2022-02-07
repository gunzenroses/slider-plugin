import IObservable from 'Interfaces/IObservable';

class Observable implements IObservable {
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
      this.listeners[eventKey].forEach((listener) => listener(args));
    }
  }
}

export default Observable;
