import { EventDispatcher } from "../assets/scripts/helpers/eventDispatcher";

describe('EventDispatcher',()=>{
    let ed = new EventDispatcher();
    let listener = function(val: number){ return val+1 };

    ed.add(listener);
    
    test('method add(): add listener to listeners', ()=>{
        expect(ed.listeners.length).toBe(1);
    })

    test('method notify(): pass arguments when it notifies listeners', ()=>{
        let message = false;
        let args = (msg: boolean)=>{ msg = true }

        ed.notify(args(message));

        expect(message).toBeTruthy;
    })

    test('method remove(): remove listener from listeners', ()=>{
        ed.remove(listener);

        expect(ed.listeners.length).toBe(0);
    })
})