import { TFunc, TFuncArg } from "Utils/types";

export default interface IObservable {
  add(listener: TFunc): void;
  remove(listener: TFunc): void;
  notify(args?: TFuncArg): void;
}
