interface IObservable<T> {
  addListener<K extends keyof T>(eventKey: K, listener: TListener<T[K]>): void;
  deleteListener<K extends keyof T>(eventKey: K, listener: TListener<T[K]>): void;
}

export default IObservable;
