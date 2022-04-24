interface IObservable<T> {
  addListener<K extends keyof T>(eventKey: K, listener: TListener<T>): void;
  deleteListener<K extends keyof T>(eventKey: K, listener: TListener<T>): void;
}

export default IObservable;
