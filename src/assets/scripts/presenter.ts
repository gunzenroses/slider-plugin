import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyRestrictions, findPosition, fromPercentstoValueApplyStep, fromValueToPercents, fromValueToPercentsApplyStep, stepToPercents, valueInPercentsWithStep } from "./common"
import { EventDispatcher } from "./eventDispatcher"

interface IPresenter {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;

    init(): void;
    selectThumb(e: any): void;
    dragThumb(e: MouseEvent): void;
    changeThumbInModel(value: number): void;
    changeThumbSecondInModel(value: number): void;
    changeThumbs(value: number): void;
    setData(name: string, data: any): void;
    updateView(): void;

    fromPresenterUpdate: EventDispatcher;
    fromPresenterThumbUpdate: EventDispatcher;
    fromPresenterThumbSecondUpdate: EventDispatcher;
}

class SliderPresenter implements IPresenter {
    model:IModel;
    view: IView;
    containerId: string;
    
    data!: TSettings;
    min!:number;
    max!: number;
    step!: number;

    fromPresenterUpdate!: EventDispatcher;
    fromPresenterThumbUpdate!: EventDispatcher;
    fromPresenterThumbSecondUpdate!: EventDispatcher;

    newThumbCurrent!: number;
    ifHorizontal!: boolean;
    ifRange!: boolean;
    containerSize!: number;
    thumbWidth!: number;
    newThumbCurrentPosition!: number;
    thumbPosition!: number;
    thumbSecondPosition!: number;

    fromModelChangeViewHandler!: { (newThumbValue: number) : void };
    fromModelUpdateViewHandler!: {(name: string, value: number): void};
    fromViewSelectThumbHandler!: { (newThumbValue: number) : void };
    fromViewDragThumbHandler!: { (newThumbValue: number) : void };
    fromViewSortActionsHandler!: {(flag: string, event: Event) : void };
    
    constructor(model: IModel, view: IView){
        this.model = model;
        this.view = view;
        this.containerId = this.model.getContainerId();
        this.fromPresenterUpdate = new EventDispatcher();
        this.fromPresenterThumbUpdate = new EventDispatcher();
        this.fromPresenterThumbSecondUpdate = new EventDispatcher();
        //this.data = this.model.getData();
        this.init();
    }

    setData(name: string, data: any){
        this.model.setData(name, data);
    }

    init(){
        this.updateView();
        this.createChildren();
        this.setupHandlers();
        this.enable();
    }

    updateView(){
        this.data = this.model.getData();
        this.view.init(this.data);
        this.fromPresenterUpdate.notify(this.data);
        this.createChildren();
    }

    createChildren(){
        this.min = this.data.min;
        this.max = this.data.max;
        this.step = this.data.step;
        this.ifHorizontal = this.data.orientation === "horizontal";
        this.ifRange = this.data.range;
        this.containerSize = (this.ifHorizontal)
                            ? parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px",""))
                            : parseInt(getComputedStyle(this.view.sliderContainer).height.replace("px",""));
        this.thumbWidth = parseInt(getComputedStyle(this.view.sliderThumb).width.replace("px",""));
    }

    setupHandlers(){
        this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
        this.fromViewDragThumbHandler = this.dragThumb.bind(this);
        this.fromModelChangeViewHandler = this.changeThumbs.bind(this);
        this.fromModelUpdateViewHandler = this.updateView.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
        this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);
        this.model.fromModelChangeView.add(this.fromModelChangeViewHandler);
        this.model.fromModelUpdateView.add(this.fromModelUpdateViewHandler);
        return this;
    }

    selectThumb(e: any){
        let newThumbCurrentPosition = this.ifHorizontal
                    ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left + this.thumbWidth/2
                    : e.clientY - this.view.sliderContainer.getBoundingClientRect().top //+ this.thumbWidth/2;
        let newThumbCurrentPercent = this.ifHorizontal
                    ? Math.floor(newThumbCurrentPosition/this.containerSize*100)
                    : Math.floor((this.containerSize - newThumbCurrentPosition)/this.containerSize*100);
        let restrictedThumbCurrent = applyRestrictions(newThumbCurrentPercent)
        this.ifRange 
            ? this.selectThumbRangeTrue(restrictedThumbCurrent)
            : this.selectThumbRangeFalse(restrictedThumbCurrent);
    }


    selectThumbRangeFalse(newThumbCurrentPercent: number){
        // this.view.selectObject = this.view.sliderThumb;
        // this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent);
        this.view.selectObject = this.view.sliderThumb;
        this.changeThumbInModel(newThumbCurrentPercent);
        this.view.selectObject = {};
    }

    selectThumbRangeTrue(newThumbCurrentPercent: number){
        let firstThumbPercent: number = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent: number = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        let firstDiff: number = Math.abs(firstThumbPercent - newThumbCurrentPercent);
        let secondDiff: number = Math.abs(secondThumbPercent - newThumbCurrentPercent);

        if (firstDiff < secondDiff){ 
            this.view.selectObject = this.view.sliderThumb;
            this.changeThumbInModel(newThumbCurrentPercent) 
        } if (firstDiff >= secondDiff){
            this.view.selectObject = this.view.sliderThumbSecond!;
            this.changeThumbSecondInModel(newThumbCurrentPercent);
        }
        this.view.selectObject = {};
    }

    dragThumb(e: any){
        let newThumbCurrentPX = this.ifHorizontal
            ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left
            : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
        let newThumbCurrent= this.ifHorizontal
                ? Math.floor(newThumbCurrentPX/this.containerSize*100)
                : Math.floor((this.containerSize - newThumbCurrentPX)/this.containerSize*100);
        this.ifRange
                ? this.dragThumbRangeTrue(newThumbCurrent)
                : this.dragThumbRangeFalse(newThumbCurrent);
    }

    dragThumbRangeFalse(newThumbCurrent: number){
        if (newThumbCurrent > 100){ newThumbCurrent = 100 }
        if (newThumbCurrent < 0){ newThumbCurrent = 0 }
        if (newThumbCurrent <= 100 && newThumbCurrent >= 0){ 
        this.changeThumbInModel(newThumbCurrent)
        } else return;
    }

    dragThumbRangeTrue(newThumbCurrent: number){
        let firstThumbPercent = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        if (this.view.dragObject === this.view.sliderThumb &&
            newThumbCurrent<= secondThumbPercent + 1 &&
            newThumbCurrent>= 0 ){
            this.changeThumbInModel(newThumbCurrent);
            return this;
        } 
        else if (this.view.dragObject === this.view.sliderThumbSecond &&
            newThumbCurrent>= firstThumbPercent + 1 &&
            newThumbCurrent<= 100){
            this.changeThumbSecondInModel(newThumbCurrent);
        } 
        else return;
    }

    changeThumbInModel(value: number){
        //this.changeThumbs(value); //in percents
        let newValue = fromPercentstoValueApplyStep(value, this.max, this.min, this.step);
        this.model.changeThumb(newValue); //as value
    }

    changeThumbSecondInModel(value: number){
        let newValue = fromPercentstoValueApplyStep(value, this.max, this.min, this.step);
        this.model.changeThumbSecond(newValue);
    }

    changeThumbs(value: number){
        // //rewrite with eventDispatcher?
        let object = (this.view.dragObject.classList !== undefined)
            ? this.view.dragObject 
            : this.view.selectObject;

        //change thumbs in panel
        (object === this.view.sliderThumb)
            ? this.fromPresenterThumbUpdate.notify(value)
            : this.fromPresenterThumbSecondUpdate.notify(value);

        //change thumbs in view
        let stepPerc = stepToPercents(this.step, this.max, this.min);
        let valPerc = fromValueToPercents(value, this.max, this.min);
        let newValue = valueInPercentsWithStep(valPerc, stepPerc);

        this.view.сhange(object, newValue);
    }
    
}

export { IPresenter, SliderPresenter }