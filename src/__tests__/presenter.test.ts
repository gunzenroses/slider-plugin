import { SliderPresenter } from "../assets/scripts/mvp/presenter";
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

describe('SliderPresenter', ()=>{
    beforeEach(()=>{
        jest.restoreAllMocks();
    })

    describe('method init()', ()=>{
        
        describe('should process events from view', ()=>{
            presenter.containerSize = 400;
            presenter.thumbWidth = 20;

            test('should notify model.changeThumb() to change thumbFirst', ()=>{
                let event = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    clientX: 100,
                    clientY: 100,
                });
                presenter.view.selectObject = presenter.view.sliderThumb;
                presenter.view.dragObject = {};
                
                let spyModelUpdate = jest.spyOn(presenter.model, "changeThumb").mockImplementation(()=>{});

                presenter.view.fromViewSelectThumb.notify(event);

                expect(spyModelUpdate).toHaveBeenCalledTimes(1);
            })

            test('should notify model.changeThumb() to change thumbSecond', ()=>{
                let event = new MouseEvent("click", {
                    clientX: 300,
                    clientY: 300,
                });
                presenter.view.dragObject = {};
                presenter.view.selectObject = presenter.view.sliderThumbSecond;
                let spyModelUpdate = jest.spyOn(presenter.model, "changeThumbSecond").mockImplementation(()=>{});

                presenter.view.fromViewSelectThumb.notify(event);

                expect(spyModelUpdate).toHaveBeenCalledTimes(1);
            })

            test('should notify model.changeThumb() to chang thumbFirst, when it was dragged', ()=>{
                let event = new MouseEvent("mousemove", {
                    clientX: 100,
                    clientY: 100,
                });
                presenter.view.dragObject = presenter.view.sliderThumb;
                let spyModelUpdate = jest.spyOn(presenter.model, "changeThumb").mockImplementation(()=>{});

                presenter.view.fromViewDragThumb.notify(event);

                expect(spyModelUpdate).toHaveBeenCalledTimes(1);
            })

            test('should notify model.changeThumb() to chang thumbSecond, when it was dragged', ()=>{
                let event = new MouseEvent("mousemove", {
                    clientX: 300,
                    clientY: 300
                });
                presenter.view.dragObject = presenter.view.sliderThumbSecond;
                let spyModelUpdate = jest.spyOn(presenter.model, "changeThumbSecond").mockImplementation(()=>{});

                presenter.view.fromViewDragThumb.notify(event);

                expect(spyModelUpdate).toHaveBeenCalledTimes(1);
            })
        })
        
        describe('should process events from model', ()=>{
            test('should notify subscribers for changes in currentThumb', ()=>{
                let value = 18;
                view.dragObject = view.sliderThumb;
                let spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbUpdate, 'notify')
                let spyFromModelChangeView = jest.spyOn(presenter.view, 'сhange').mockImplementation(()=>{});

                model.fromModelChangeView.notify(value);

                expect(spyfromModelUpdate).toHaveBeenCalledWith(value);
                expect(spyFromModelChangeView).toHaveBeenCalledWith(presenter.view.sliderThumb, value);
            })
            
            test('should notify subscribers for changes in currentThumbSecond', ()=>{
                let value = 18;
                view.dragObject = view.sliderThumbSecond;
                let spyfromModelUpdate = jest.spyOn(presenter.fromPresenterThumbSecondUpdate, 'notify')
                let spyFromModelChangeView = jest.spyOn(presenter.view, 'сhange').mockImplementation(()=>{});

                model.fromModelChangeView.notify(value);

                expect(spyfromModelUpdate).toHaveBeenCalledWith(value);
                expect(spyFromModelChangeView).toHaveBeenCalledWith(presenter.view.sliderThumbSecond, value);
            })
        })

        describe('should process full data updates in model', ()=>{
            test('calls updateView method', ()=>{
                let spyUpdateView = jest.spyOn(presenter, 'updateView');
    
                model.fromModelUpdateData.notify();
    
                expect(spyUpdateView).toHaveBeenCalledTimes(1);
            })
            test('notify subscribers', () => {
                let spyFromPresenterUpdate = jest.spyOn(presenter.fromPresenterUpdate, 'notify');
    
                model.fromModelUpdateData.notify();
    
                expect(spyFromPresenterUpdate).toHaveBeenCalledTimes(1);
            })
        })
    })

    describe('method updateView()', ()=>{

        test('should get data from model', ()=>{
            presenter.init();

            expect(presenter.data).toEqual(model.getData());
        })

        test('should initiate view', ()=>{
            let spyOnView = jest.spyOn(view, 'init');

            presenter.init();

            expect(spyOnView).toHaveBeenCalledTimes(1);
            expect(spyOnView).toHaveBeenCalledWith(model.getData());
        })
    }) 

    describe('method setData()', ()=>{
        test('should call model.setData() with provided params', ()=>{
            let name = 'min';
            let data = 15;
            let spySetDataInModel = jest.spyOn(model, 'setData');

            presenter.setData(name, data);

            expect(spySetDataInModel).toHaveBeenCalledTimes(1);
            expect(spySetDataInModel).toHaveBeenCalledWith(name, data);
        })
    })
})