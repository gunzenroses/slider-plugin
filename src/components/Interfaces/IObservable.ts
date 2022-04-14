interface IObservable {
  addListener(eventKey: string, listener: TListener): void;
  notifyListener(eventKey: string, args: TListenerArg): void;
  notifyListener(eventKey: string): void;
  deleteListener(eventKey: string, listener: TListener): void;
  deleteKey(eventKey: string): void;
}

export default IObservable;
