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

    describe('method getContainerId', ()=>{
        test('should return id, which was passed to constructor', ()=>{
            expect(model.getContainerId()).toEqual(containerClass);
        })
    })

    describe('method getData()', ()=>{
        test('should be called', ()=>{
            const spyGetData = jest.spyOn(model, "getData");

            model.getData();

            expect(spyGetData).toHaveBeenCalledTimes(1);
        })

        test('return object wich were passed into constructor data', ()=>{
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

    describe('method updateCurrentsWithStep()', ()=>{
        test('should make currentThumb multiple of step', ()=>{
            let newCF = { name: "currentFirst", data: 26 };
            let step = model.getData().step;
            let multiple = Math.trunc((newCF.data/step)*step);

            model.setData(newCF.name, newCF.data);
            
            expect(model.getData().currentFirst).toBe(multiple);
        })

        test('should make currentThumbSecond multiple of step', ()=>{
            let newCF = { name: "currentSecond", data: 35 };
            let step = model.getData().step;
            let multiple = Math.trunc((newCF.data/step)*step);

            model.setData(newCF.name, newCF.data);
            
            expect(model.getData().currentSecond).toBe(multiple);
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
    })
})