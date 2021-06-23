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

    describe('getData()', ()=>{
        test('return object with data', ()=>{
            //assertion
            expect(model.getData()).toEqual(data);
        })

        test('should be called', ()=>{
            //arrange
            const spyGetData = jest.spyOn(model, "getData");

            //action
            model.getData();

            //assertion
            expect(spyGetData).toHaveBeenCalled();
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

    describe('setData()', ()=>{
        //arrange
        let newData: TSettings;
        newData = {
            min: 20,
            max: 200,
            range: false,
            currentFirst: 20,
            currentSecond: 40,
            step: 11,
            orientation: "horizontal",
            tooltip: false,
            scale: true,
        }

        test('replace previous data with the new one', ()=>{
            //act
            model.setData(newData)
            //assert
            expect(model.getData()).toEqual(newData);
        })
    })

    describe('getContainerId()', ()=>{
        test('return string with containerId',()=>{
            expect(model.getContainerId()).toEqual(containerClass);
        })
    })

    describe('changeThumb()', ()=>{
        test('should be called',()=>{
            let obj = {data: "some"};
            let val = 1;
            const spyChangeThumb = jest.spyOn(model, "changeThumb");

            model.changeThumb(obj, val)

            expect(model.changeThumb).toBeCalledTimes(1)
        })

        test('should call EventDispatcher', ()=>{
            

        })
    })
})


// const sum = jest.fn((x,y)=> x+y);
// expect(sum(2,3)).toBe(5);
// expect(sum).toHaveBeenCalled();
// expect(sum).toHaveBeenCalledWith(2,3)