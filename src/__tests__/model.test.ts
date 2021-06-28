import { IModel, SliderModel } from "../assets/scripts/model"
import { sliderData } from "../assets/scripts/data"
import { TSettings } from "../assets/scripts/types/types"

describe('class SliderModel', ()=>{
    let containerClass: string;
    let data: TSettings;
    let model: IModel;

    beforeEach(()=>{
        containerClass = 'container1';
        data = sliderData;

        model = new SliderModel(containerClass, data);
    })

    describe('method getData()', ()=>{
        test('should be called', ()=>{
            const spyGetData = jest.spyOn(model, "getData");

            model.getData();

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
            let newData = {some: data}

            model.setData(newData)
            
            expect(model.getData()).toEqual(newData);
        })
    })

    describe('method getContainerId()', ()=>{
        test('return string with containerId passed into constructor',()=>{
            expect(model.getContainerId()).toEqual(containerClass);
        })
    })

    describe('method changeThumb()', ()=>{
        let val = 3;

        test('should be called',()=>{
            const spyChangeThumb = jest.spyOn(model, "changeThumb");

            model.changeThumb(val);

            expect(spyChangeThumb).toBeCalledTimes(1);
        })

        test('should change data.currentFirst', ()=>{
            model.changeThumb(val);

            expect(model.getData()).toHaveProperty('currentFirst', val);
        })

        test('should notify subscribers', ()=>{
            const spyNotify = jest.spyOn(model, "notify");

            model.changeThumb(val);

            expect(spyNotify).toHaveBeenCalledTimes(1);
        })
    })

    describe('method changeThumbSecond()', ()=>{
        let obj = {};
        let num = 5;

        test('should be called', ()=>{
            const spyChangeThumbSecond = jest.spyOn(model, "changeThumbSecond");

            model.changeThumbSecond(num);

            expect(spyChangeThumbSecond).toBeCalledTimes(1);
        })

        test('should change the value of data.CurrentSecond', ()=>{
            model.changeThumbSecond(num);

            expect(model.getData()).toHaveProperty('currentSecond', num);
        })

        test('should notify subscribers', ()=>{
            let spyChangeThumbSecond = jest.spyOn(model, 'notify');
            
            model.changeThumbSecond(num);
            
            expect(spyChangeThumbSecond).toHaveBeenCalledTimes(1)
        })
    })
})