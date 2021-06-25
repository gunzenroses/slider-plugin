import { EventDispatcher } from "../assets/scripts/eventDispatcher";

describe('eventDispatcher',()=>{
    //arrange
    let ed = new EventDispatcher();
    let listener = function(val: number){ return val+1 };
    //act
    ed.add(listener);
    
    describe('function add()', ()=>{
        test('should add listener to listeners', ()=>{
            //assert
            expect(ed.listeners.length).toBe(1);
        })

        test('should pass arguments when it notifies listeners', ()=>{
            //arrange
            let message = false;
            let args = (msg: boolean)=>{ msg = true }

            //act
            ed.notify(args(message));

            //assert
            expect(message).toBeTruthy;
        })

        test('should remove listener from listeners', ()=>{
            //act
            ed.remove(listener);

            //assert
            expect(ed.listeners.length).toBe(0);
        })
    })
})