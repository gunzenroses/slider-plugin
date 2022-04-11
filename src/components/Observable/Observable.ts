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

  deleteListener(eventKey: string, listener: TListener): void {
    if (listener) {
      const index = this.listeners[eventKey].indexOf(listener);
      if (index !== -1) {
        this.listeners[eventKey].splice(index, 1);
      }
      const lengthOfListeners = this.listeners[eventKey].length;
      if (lengthOfListeners === 0) {
        delete this.listeners[eventKey];
      }
    }
  }

  deleteKey(eventKey: string): void {
    delete this.listeners[eventKey];
  }
}

export default Observable;
