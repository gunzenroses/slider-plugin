class EventDispatcher {
    constructor(sender){
        this._sender = sender;
        this._listeners = new Array();
    }

    add(listener){
        this._listeners.push(listener);
    }

    remove(listener){
        let index = this._listeners.indexOf(listener);
        this._listeners.splice(index,1);
    }

    notify(args){
        this._listeners.forEach(listener => listener(args));
    }
}

export { EventDispatcher }