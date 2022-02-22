interface IObservable {
  add(eventKey: string, listener: TListener): void;
  notify(eventKey: string, args: TListenerArg): void;
  notify(eventKey: string): void;
  delete(eventKey: string, listener?: TListener): void;
}

export default IObservable;
