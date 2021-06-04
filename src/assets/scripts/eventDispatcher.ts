interface Subject {
    add(listener: Observer): void;
    remove(listener: Observer): void;
    notify(args: any): void;
}

interface Observer {
    //update(temperature: number): void;
}

class EventDispatcher implements Subject  {
    private _sender: object;
    private _listeners = new Array();

    constructor(sender: object){
        this._sender = sender;
    }

    public add(listener: Observer): void {
        this._listeners.push(listener);
    }

    public remove(listener: Observer): void {
        let index = this._listeners.indexOf(listener);
        this._listeners.splice(index,1);
    }

    public notify(args: any): void {
        this._listeners.forEach(listener => listener(args));
    }
}

export { EventDispatcher }