import { TFunc } from "utils/types";
interface ISender {
    add(listener: TFunc): void;
    remove(listener: TFunc): void;
    notify(args: number | Event): void;
}
declare class EventDispatcher implements ISender {
    listeners: Array<TFunc>;
    add(listener: TFunc): void;
    remove(listener: TFunc): void;
    notify(args?: Event | number): void;
}
export { ISender, EventDispatcher };
