import { IModel, SliderModel } from "../assets/scripts/model";
import { sliderData } from "../assets/scripts/data";
import { TSettings } from "../assets/scripts/types/types";

describe('class Model', ()=>{
    let containerClass: string;
    let data: TSettings;
    let model: IModel;

    beforeEach(()=>{
        //arrange
        containerClass = 'container1';
        data = sliderData;

        //act
        model = new SliderModel(containerClass, data);
    })

    describe('method getData()', ()=>{
        test('should be called', ()=>{
            //arrange
            const spyGetData = jest.spyOn(model, "getData");

            //action
            model.getData();

            //assertion
            expect(spyGetData).toHaveBeenCalledTimes(1);
        })

        test('return object with passed into constructor data', ()=>{
            //assertion
            expect(model.getData()).toEqual(data);
        })

        test('have valid properties(min, max, range, currentFirst, currentSecond, step, orientation, tooltip, scale)', ()=>{
            //assertion
            expect(model.getData()).toHaveProperty('min');
            expect(model.getData()).toHaveProperty('max');
            expect(model.getData()).toHaveProperty('range');
            expect(model.getData()).toHaveProperty('currentFirst');
            expect(model.getData()).toHaveProperty('currentSecond');
            expect(model.getData()).toHaveProperty('step');
            expect(model.getData()).toHaveProperty('orientation');
            expect(model.getData()).toHaveProperty('tooltip');
            expect(model.getData()).toHaveProperty('scale');
        })
    })

    describe('method setData()', ()=>{
        test('replace previous data with passed into method data', ()=>{
            //arrange
            let newData = {some: data}

            //act
            model.setData(newData)
            
            //assert
            expect(model.getData()).toEqual(newData);
        })
    })

    describe('method getContainerId()', ()=>{
        test('return string with containerId passed into constructor',()=>{
            expect(model.getContainerId()).toEqual(containerClass);
        })
    })

    describe('method changeThumb()', ()=>{
        let obj = {};
        let val = 3;

        test('should be called',()=>{
            //arrange
            const spyChangeThumb = jest.spyOn(model, "changeThumb");
            //act
            model.changeThumb(obj, val);
            //assertion
            expect(model.changeThumb).toBeCalledTimes(1);
        })

        test('should change data.currentFirst', ()=>{
            //act
            model.changeThumb(obj, val);
            //assertion
            expect(model.getData()).toHaveProperty('currentFirst', val);
        })

        test('should notify subscribers', ()=>{
            //arrange
            const spyNotify = jest.spyOn(model, "notify");
            //act
            model.changeThumb(obj, val);
            //assertion
            expect(model.notify).toHaveBeenCalledTimes(1);
        })
    })

    describe('method changeThumbSecond()', ()=>{
        let obj = {};
        let num = 5;

        test('should be called', ()=>{
            const spyChangeThumbSecond = jest.spyOn(model, "changeThumbSecond");

            model.changeThumbSecond(obj, num);

            expect(model.changeThumbSecond).toBeCalledTimes(1);
        })

        test('should change the value of data.CurrentSecond', ()=>{
            model.changeThumbSecond(obj, num);

            expect(model.getData()).toHaveProperty('currentSecond', num);
        })

        test('should notify subscribers', ()=>{
            let spyChangeThumbSecond = jest.spyOn(model, 'notify');
            
            model.changeThumbSecond(obj, num);
            
            expect(model.notify).toHaveBeenCalledTimes(1)
        })
    })
})


// const sum = jest.fn((x,y)=> x+y);
// expect(sum(2,3)).toBe(5);
// expect(sum).toHaveBeenCalled();
// expect(sum).toHaveBeenCalledWith(2,3)