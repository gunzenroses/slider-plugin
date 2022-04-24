import IObservable from 'Interfaces/IObservable';

abstract class Observable<T extends Record<string, unknown>> implements IObservable<T> {
  listeners: TListenerArr<T> = {} as TListenerArr<T>;

  addListener<K extends keyof T>(eventKey: K, listener: TListener<T>): void {
    if (this.listeners[eventKey]) {
      this.listeners[eventKey].push(listener);
    } else {
      this.listeners[eventKey] = [listener];
    }
  }

  deleteListener<K extends keyof T>(eventKey: K, listener: TListener<T>): void {
    if (listener) {
      const index = this.listeners[eventKey].indexOf(listener);
      if (index !== -1) {
        this.listeners[eventKey].splice(index, 1);
      }
    }
  }

  protected notifyListener<K extends keyof T>(eventKey: K, args: T[K]): void {
    if (this.listeners[eventKey]) {
      this.listeners[eventKey].forEach((listener) => listener(args));
    }
  }
}

export default Observable;
