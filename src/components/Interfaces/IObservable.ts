interface IObservable {
  add(eventKey: string, listener: TListener): void;
  notify(eventKey: string, args: TListenerArg): void;
  notify(eventKey: string): void;
  deleteListener(eventKey: string, listener: TListener): void;
  deleteKey(eventKey: string): void;
}

export default IObservable;
