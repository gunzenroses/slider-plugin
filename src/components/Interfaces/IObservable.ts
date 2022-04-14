interface IObservable {
  addListener<T>(eventKey: string, listener: TListener<T>): void;
  deleteListener<T>(eventKey: string, listener: TListener<T>): void;
  deleteKey(eventKey: string): void;
}

export default IObservable;
