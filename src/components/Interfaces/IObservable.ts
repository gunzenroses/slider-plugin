interface IObservable {
  addListener<T>(eventKey: string, listener: TListener<T>): void;
  deleteListener<T>(eventKey: string, listener: TListener<T>): void;
}

export default IObservable;
