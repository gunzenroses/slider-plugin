import IObservable from 'Interfaces/IObservable';

abstract class Observable implements IObservable {
  listeners: TListenerArr = {};

  addListener<T>(eventKey: string, listener: TListener<T>): void {
    if (this.listeners[eventKey]) {
      this.listeners[eventKey].push(listener);
    } else {
      this.listeners[eventKey] = [listener];
    }
  }

  deleteListener<T>(eventKey: string, listener: TListener<T>): void {
    if (listener) {
      const index = this.listeners[eventKey].indexOf(listener);
      if (index !== -1) {
        this.listeners[eventKey].splice(index, 1);
      }
    }
  }

  protected notifyListener<T>(eventKey: string, args?: T): void {
    if (this.listeners[eventKey]) {
      this.listeners[eventKey].forEach((listener) => listener(args));
    }
  }
}

export default Observable;
