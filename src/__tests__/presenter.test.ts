import { SliderPresenter } from "../assets/scripts/presenter";
import { SliderModel } from "../assets/scripts/model";
import { SliderView } from "../assets/scripts/view";
import { sliderData } from "../assets/scripts/data";
import { mergeData } from "../assets/scripts/common";

let containerId = "container1"
let initialContainer = document.createElement("div");
initialContainer.id = containerId;
document.body.append(initialContainer);

let model = new SliderModel(containerId, sliderData);
let view = new SliderView(containerId);
let presenter = new SliderPresenter(model, view);

describe('SliderPresenter', ()=>{
    beforeEach(()=>{
        jest.restoreAllMocks();
    })

    describe('method init()', ()=>{
        test('calls methods view.init(), createChildren(), setupHandlers(), enable()', ()=>{
            let spyView = jest.spyOn(view, 'init');
            let spyCreateChildren = jest.spyOn(presenter, 'createChildren');
            let spySetupHandlers = jest.spyOn(presenter, 'setupHandlers');
            let spyEnable = jest.spyOn(presenter, 'enable');

            presenter.init();

            expect(spyView).toHaveBeenCalledTimes(1);
            expect(spyCreateChildren).toHaveBeenCalledTimes(1);
            expect(spySetupHandlers).toHaveBeenCalledTimes(1);
            expect(spyEnable).toHaveBeenCalledTimes(1);
        })
    })

    describe('fucntion createChildren()', ()=>{
        test('initialize variables: min, max, step, ifHorizontal, ifRange, containerSize and thumbWidth', ()=>{
            presenter.createChildren();

            expect(presenter.min).toBe(sliderData.min);
            expect(presenter.max).toBe(sliderData.max);
            expect(presenter.step).toBe(sliderData.step);
            expect(presenter.ifHorizontal).toBeTruthy();
            expect(presenter.ifRange).toBe(sliderData.range);
            expect(presenter.containerSize).not.toBeNaN;
            expect(presenter.thumbWidth).not.toBeNaN;
        })
    })

    describe('method selectThumb()', ()=>{
        test('calls selectThumbRangeTrue() if (range === true)', () => {
            let spySelectThumbRangeTrue = jest.spyOn(presenter, 'selectThumbRangeTrue');
            presenter.ifRange = true;
            let mockEvent = {
                ... new MouseEvent('click')
            }

            presenter.selectThumb(mockEvent);

            expect(spySelectThumbRangeTrue).toBeCalledTimes(1);
        })
        
        test('calls selectThumbRangeFalse() if (range === false)', () => {
            let spySelectThumbRangeFalse = jest.spyOn(presenter, 'selectThumbRangeFalse').mockImplementation();
            presenter.ifRange = false;
            let mockEvent = {
                ... new MouseEvent('click')
            }

            presenter.selectThumb(mockEvent);

            expect(spySelectThumbRangeFalse).toBeCalledTimes(1);
        })
    })

    describe('method dragThumb()', ()=>{
        test('calls dragThumbRangeTrue() if (range === true)', () => {
            let spyDragThumbRangeTrue = jest.spyOn(presenter, 'dragThumbRangeTrue').mockImplementation();
            presenter.ifRange = true;
            let mockEvent = {
                ... new MouseEvent('click')
            }

            presenter.dragThumb(mockEvent);

            expect(spyDragThumbRangeTrue).toBeCalledTimes(1);
        })
        
        test('calls dragThumbRangeFalse() if (range === false)', () => {
            let spyDragThumbRangeFalse = jest.spyOn(presenter, 'dragThumbRangeFalse').mockImplementation();
            presenter.ifRange = false;
            let mockEvent = {
                ... new MouseEvent('click')
            }

            presenter.dragThumb(mockEvent);

            expect(spyDragThumbRangeFalse).toBeCalledTimes(1);
        })
        
    })

    describe('method changeThumbInModel()', ()=>{
        test('calls model.changeThumb() method with provided arguments ', () => {
            let spyModelChangeThumb = jest.spyOn(model, 'changeThumb').mockImplementation();
            let value = 7;
    
            presenter.changeThumbInModel(value);
    
            expect(spyModelChangeThumb).toBeCalledTimes(1);
            expect(spyModelChangeThumb).toBeCalledWith(value);
        })
    })

    describe('method changeThumbSecondInModel()', ()=>{
        test('calls model.changeThumbSecond() with provided argumets', () => {
            let spyModelChangeThumbSecond = jest.spyOn(model, 'changeThumbSecond').mockImplementation();
            let value = 7;

            presenter.changeThumbSecondInModel(value);

            expect(spyModelChangeThumbSecond).toBeCalledTimes(1);
            expect(spyModelChangeThumbSecond).toBeCalledWith(value);
        })
    })

    describe('method changeView()', ()=>{
        test('calls view.change() method with provided argument', ()=>{
            let value = 11;
            let spyNotify = jest.spyOn(presenter.view, 'сhange').mockImplementation();

            presenter.changeView(value);

            expect(spyNotify).toHaveBeenCalledTimes(1);
            expect(spyNotify).toBeCalledWith(value);
        })
    })

    describe('method setData()', ()=>{
        test('calls model.setData() with provided arguments', ()=>{
            let args = {
                min: 11
            }
            let spyOnModel = jest.spyOn(model, 'setData');

            presenter.setData(args);

            expect(spyOnModel).toBeCalledTimes(1);
            expect(spyOnModel).toBeCalledWith(args);
        })
    })

    describe('method updateView()', ()=>{
        test('calls view.init()', () => {
            let spyOnView = jest.spyOn(view, 'init');

            presenter.updateView();

            expect(spyOnView).toBeCalledTimes(1);
        })
        
    })
})