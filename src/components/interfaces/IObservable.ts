import { TListener, TListenerArg } from "Utils/types";

export default interface IObservable {
  add(eventKey: string, listener: TListener): void;
  notify(eventKey: string, args?: TListenerArg): void;
}
