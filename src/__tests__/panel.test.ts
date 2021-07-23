import { ConfigurationPanel } from "../assets/scripts/panel/panel";
import { SliderPresenter } from "../assets/scripts/mvp/presenter"
import { SliderModel } from "../assets/scripts/mvp/model";
import { SliderView } from "../assets/scripts/mvp/view";
import { sliderData } from "../assets/scripts/mvp/data";

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