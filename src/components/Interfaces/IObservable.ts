interface IObservable {
  addListener(eventKey: string, listener: TListener): void;
  deleteListener(eventKey: string, listener: TListener): void;
  deleteKey(eventKey: string): void;
}

export default IObservable;
