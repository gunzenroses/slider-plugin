interface ISender {
    add(listener: object): void;
    remove(listener: object): void;
    notify(args: any): void;
}

class EventDispatcher implements ISender  {
    private _sender: object;
    private _listeners = new Array();

    constructor(){
        this._sender = this;
    }

    add(listener: object): void {
        this._listeners.push(listener);
    }

    remove(listener: object): void {
        let index = this._listeners.indexOf(listener);
        this._listeners.splice(index,1);
    }

    notify(args: any): void {
        this._listeners.forEach(listener => listener(args));
    }
}

export { ISender, EventDispatcher }