interface ISender {
    add(listener: object): void;
    remove(listener: object): void;
    notify(args: any): void;
}
declare class EventDispatcher implements ISender {
    private _sender;
    listeners: any[];
    constructor();
    add(listener: object): void;
    remove(listener: object): void;
    notify(...args: any): void;
}
export { ISender, EventDispatcher };
