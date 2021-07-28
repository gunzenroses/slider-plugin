import ConfigurationPanel from "panel/panel";
import { SliderPresenter } from "mvp/presenter"
import { SliderModel } from "mvp/model";
import { SliderView } from "mvp/view";
import { sliderData } from "mvp/data";

let containerId = "container1"
let initialContainer = document.createElement("div");
initialContainer.id = containerId;
document.body.append(initialContainer);

let model = new SliderModel(containerId, sliderData);
let view = new SliderView(containerId);
let presenter = new SliderPresenter(model, view);
let panel = new ConfigurationPanel(containerId, presenter);

describe('Panel', ()=>{
    beforeEach(()=>{
        jest.restoreAllMocks();
    })

    describe('method render()', ()=>{
        test('should create panel items', ()=>{
            panel.checkboxes = panel.panelContainer.querySelectorAll("input[type='checkbox']");
            panel.orientationInput = <HTMLInputElement>panel.panelContainer.querySelector('select[name="orientation"]');
            panel.numberInputs = panel.panelContainer.querySelectorAll("input[type='number']")
    
            panel.minInput = <HTMLInputElement>panel.panelContainer.querySelector('input[name="min"]');
            panel.maxInput = <HTMLInputElement>panel.panelContainer.querySelector('input[name="max"]');
            panel.stepInput = <HTMLInputElement>panel.panelContainer.querySelector('input[name="step"]');
            panel.currentFirstInput = <HTMLInputElement>panel.panelContainer.querySelector('input[name="currentFirst"]');
            panel.currentSecondInput = <HTMLInputElement>panel.panelContainer.querySelector('input[name="currentSecond"]');

            panel.render(panel.presenter.data);

            expect(panel.checkboxes).toBeTruthy();
            expect(panel.orientationInput).toBeTruthy();
            expect(panel.numberInputs).toBeTruthy();
            expect(panel.minInput).toBeTruthy();
            expect(panel.maxInput).toBeTruthy();
            expect(panel.stepInput).toBeTruthy();
            expect(panel.currentFirstInput).toBeTruthy();
            expect(panel.currentSecondInput).toBeTruthy();
        })
    })

    describe('handlers for events', ()=>{
        describe('presenter.fromPresenterUpdate', ()=>{
            test('should call updatePanel()', () => {
                let spyOnUpdatePanel = jest.spyOn(panel, "updatePanel").mockImplementation(()=>{});
                
                panel.init();
                panel.presenter.fromPresenterUpdate.notify();

                expect(spyOnUpdatePanel).toHaveBeenCalledTimes(1);
            }) 
        })

        describe('presenter.fromPresenterThumbUpdate', ()=>{
            test('should call updateThumb()', () => {
                let spyOnUpdateThumb = jest.spyOn(panel, "updateThumb").mockImplementation();
                
                panel.init();
                panel.presenter.fromPresenterThumbUpdate.notify();

                expect(spyOnUpdateThumb).toHaveBeenCalledTimes(1);
            }) 
        })

        describe('presenter.fromPresenterThumbSecondUpdate', ()=>{
            test('should call updateThumbSecond()', () => {
                let spyOnUpdateThumbSecond = jest.spyOn(panel, "updateThumbSecond").mockImplementation();
                
                panel.init();
                panel.presenter.fromPresenterThumbSecondUpdate.notify();

                expect(spyOnUpdateThumbSecond).toHaveBeenCalledTimes(1);
            }) 
        })
    })

    describe('method changePanel()', ()=>{
        test('should call presenter.setData()', ()=>{
            let spyPresenter = jest.spyOn(panel.presenter, "setData").mockImplementation(()=>{});
            let trg = panel.panelContainer.querySelector("input[name='range']");
            let evt = {
                ...new Event('click'),
                target: trg
            }

            panel.changePanel(evt);

            expect(spyPresenter).toHaveBeenCalledTimes(1);
        })

        describe('should validate data for input[type="number"]', () => {
            test('return false when input.value="" ', () => {
                let trg: HTMLInputElement = panel.panelContainer.querySelector("input[name='max']")!;
                trg.value = "";

                trg.dispatchEvent(new Event('change'));

                expect(trg.checkValidity()).toBeFalsy();
            })
            test('add error-message when value is not a number ', () => {
                let trg: HTMLInputElement = panel.panelContainer.querySelector("input[name='max']")!;
                trg.setAttribute('max', '100');
                trg.value = "Cat";

                trg.dispatchEvent(new Event('change'));

                expect(panel.validation.invalidities).toContain("Should be a number");
            })

            test('add error-message when value > max', () => {
                let trg: HTMLInputElement = panel.panelContainer.querySelector("input[name='currentSecond']")!;
                trg.setAttribute('max', '100');
                trg.value = '120';

                trg.dispatchEvent(new Event('change'));

                expect(panel.validation.invalidities).toContain("Number should be maximum 100");
            })

            // test('add error-message when value < min', () => {
            //     let trg: HTMLInputElement = panel.panelContainer.querySelector("input[name='step']")!;
            //     trg.value = '0';

            //     trg.dispatchEvent(new Event('change'));

            //     expect(panel.validation.invalidities).toContain("Number should be minimum 1");
            // })

            test('add error-message when stepMismatch', () => {
                let trg: HTMLInputElement = panel.panelContainer.querySelector("input[name='currentFirst']")!;
                trg.setAttribute('min', '10'); 
                trg.setAttribute('step', '8');
                trg.value = '32';

                trg.dispatchEvent(new Event('change'));

                expect(panel.validation.invalidities).toContain("Number should be: 10 + multiple of 8");
            })            
        })
    })

    describe('method updatePanel()', ()=>{        
        test('should update data', () => {
            panel.data.step = 8;
            panel.data.min = 10;
            panel.data.max = 100;
            panel.updatePanel();

            expect(parseInt(panel.stepInput.value)).toBe(panel.data.step);
            expect(parseInt(panel.minInput.value)).toBe(panel.data.min);
            expect(parseInt(panel.maxInput.value)).toBe(panel.data.max);
            expect(parseInt(panel.currentFirstInput.min)).toBe(panel.data.min);
            expect(parseInt(panel.currentFirstInput.value)).toBe(panel.data.currentFirst);
            expect(parseInt(panel.currentFirstInput.step)).toBe(panel.data.step);
            expect(parseInt(panel.currentSecondInput.min)).toBe(panel.data.currentFirst);
            expect(parseInt(panel.currentSecondInput.value)).toBe(panel.data.currentSecond);
            expect(parseInt(panel.currentSecondInput.step)).toBe(panel.data.step);
        })
    })

})