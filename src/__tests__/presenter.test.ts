import { SliderPresenter } from "../assets/scripts/presenter";
import { SliderModel } from "../assets/scripts/model";
import { SliderView } from "../assets/scripts/view";
import { sliderData } from "../assets/scripts/data";

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

    describe('function init()', ()=>{
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

    describe('function sortThumbActions()', ()=>{
        test('calls selectThumb method if passed argument has a (flag === selectThumb)', () => {
            let spySelectThumb = jest.spyOn(presenter, 'selectThumb');
            let flag = 'selectThumb';
            let e = new Event('click')

            presenter.sortThumbActions(flag, e);
            
            expect(spySelectThumb).toBeCalledTimes(1);
        })

        test('calls dragThumb method if passed argument has a (flag === dragThumb)', () => {
            let spyDragThumb = jest.spyOn(presenter, 'dragThumb');
            let flag = 'dragThumb';
            let e = new Event('dragmove');

            presenter.sortThumbActions(flag, e);

            expect(spyDragThumb).toBeCalledTimes(1);
        })

        test('does not call any method if passed argument has a wrong (flag)', () => {
            let spySelectThumb = jest.spyOn(presenter, 'selectThumb');
            let spyDragThumb = jest.spyOn(presenter, 'dragThumb');
            let flag = 'anythingElse';
            let e = new Event('dragmove');

            presenter.sortThumbActions(flag, e);

            expect(spySelectThumb).not.toBeCalled();
            expect(spyDragThumb).not.toBeCalled();
        })
    })

    describe('function selectThumb()', ()=>{
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
            let spySelectThumbRangeFalse = jest.spyOn(presenter, 'selectThumbRangeFalse');
            presenter.ifRange = false;
            let mockEvent = {
                ... new MouseEvent('click')
            }

            presenter.selectThumb(mockEvent);

            expect(spySelectThumbRangeFalse).toBeCalledTimes(1);
        })
    })

    describe('function dragThumb()', ()=>{
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

    describe('function changeThumbInModel()', ()=>{
        test('calls model.changeThumb() method with provided arguments ', () => {
            let spyModelChangeThumb = jest.spyOn(model, 'changeThumb').mockImplementation();
            let object = {};
            let value = 7;
    
            presenter.changeThumbInModel(object, value);
    
            expect(spyModelChangeThumb).toBeCalledTimes(1);
            expect(spyModelChangeThumb).toBeCalledWith(object, value);
        })
    })

    describe('function changeThumbSecondInModel()', ()=>{
        test('calls model.changeThumbSecond() with provided argumets', () => {
            let spyModelChangeThumbSecond = jest.spyOn(model, 'changeThumbSecond').mockImplementation();
            let object = {};
            let value = 7;

            presenter.changeThumbSecondInModel(object, value);

            expect(spyModelChangeThumbSecond).toBeCalledTimes(1);
            expect(spyModelChangeThumbSecond).toBeCalledWith(object, value);
        })
    })

    describe('function changeView()', ()=>{
        test('calls view.change() method with provided arguments', ()=>{
            let spyViewChange = jest.spyOn(view, 'сhange').mockImplementation();
            let object = {};
            let value = 11;

            presenter.changeView(object, value);

            expect(spyViewChange).toBeCalledTimes(1);
            expect(spyViewChange).toBeCalledWith(object, value);
        })

        test('clears data in view.selecObject()', () => {
            expect(view.selectObject).toEqual({});
        })
        
    })
})