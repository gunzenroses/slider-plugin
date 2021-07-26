import { IModel, SliderModel } from "../assets/scripts/mvp/model"
import { sliderData } from "../assets/scripts/mvp/data"
import { TSettings } from "../assets/scripts/types/types"
import { adjustValue } from "../assets/scripts/helpers/adjustData";

describe('class SliderModel', ()=>{
    let containerClass: string;
    let data: TSettings;
    let model: IModel;

    beforeEach(()=>{
        containerClass = 'container1';
        data = sliderData;
        model = new SliderModel(containerClass, data);
        jest.restoreAllMocks();
    })

    describe('method setData', ()=>{
        test('should update step, min and max data in model', () => {
            let step = 10;
            let min = 2;
            let max = 200;

            model.setData('step', step);
            model.setData('min', min);
            model.setData('max', max);

            expect(model.getData()).toHaveProperty('step', step);
            expect(model.getData()).toHaveProperty('min', min);
            expect(model.getData()).toHaveProperty('max', max);
            
        })

        test('should update currentFirst and currentSecond data in model', () => {
            let currentFirst = adjustValue('currentFirst', 11, model.getData());
            let currentSecond = adjustValue('currentSecond', 35, model.getData());

            model.setData('currentFirst', currentFirst);
            model.setData('currentSecond', currentSecond);

            expect(model.getData()).toHaveProperty('currentFirst', currentFirst);
            expect(model.getData()).toHaveProperty('currentSecond', currentSecond);
        })
        
        
    })

    describe('method getContainerId', ()=>{
        test('should return id, which was passed to constructor', ()=>{
            expect(model.getContainerId()).toEqual(containerClass);
        })
    })

    describe('method getData()', ()=>{
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