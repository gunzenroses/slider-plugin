interface ISender {
  add(listener: object): void;
  remove(listener: object): void;
  notify(args: any): void;
}

class EventDispatcher implements ISender {
  listeners = new Array();

  add(listener: object): void {
    this.listeners.push(listener);
  }

  remove(listener: object): void {
    let index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }

  notify(...args: any): void {
    this.listeners.forEach((listener) => listener(...args));
  }
}

export { ISender, EventDispatcher };
