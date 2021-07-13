import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyRestrictions, findPosition, fromPercentsToValueApplyStep, changeValueToPercentsApplyStep } from "./common"
import { EventDispatcher } from "./eventDispatcher"

interface IPresenter {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;

    init(): void;
    setData(name: string, data: any): void;

    fromPresenterUpdate: EventDispatcher;
    fromPresenterThumbUpdate: EventDispatcher;
    fromPresenterThumbSecondUpdate: EventDispatcher;
}

class SliderPresenter implements IPresenter {
    model:IModel;
    view: IView;
    containerId: string;
    data!: TSettings;

    fromPresenterUpdate!: EventDispatcher;
    fromPresenterThumbUpdate!: EventDispatcher;
    fromPresenterThumbSecondUpdate!: EventDispatcher;

    private min!:number;
    private max!: number;
    private step!: number;

    private ifHorizontal!: boolean;
    private ifRange!: boolean;
    private containerSize!: number;
    private thumbWidth!: number;

    fromModelChangeViewHandler!: { (newThumbValue: number) : void };
    fromModelUpdateDataHandler!: {(data: TSettings): void};
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
        this.init();
    }

    init(){
        this.updateView();
        this.setupHandlers();
        this.enable();
    }

    // maybe join with init
    private updateView(){
        this.data = this.model.getData();
        this.view.init(this.data);
        this.createChildren();
    }

    private createChildren(){
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

    private setupHandlers(){
        this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
        this.fromViewDragThumbHandler = this.dragThumb.bind(this);
        this.fromModelChangeViewHandler = this.changeThumbs.bind(this);
        this.fromModelUpdateDataHandler = this.updateDataEverywhere.bind(this);
        return this;
    }

    private enable(){
        this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
        this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);
        this.model.fromModelChangeView.add(this.fromModelChangeViewHandler);
        this.model.fromModelUpdateData.add(this.fromModelUpdateDataHandler);
        return this;
    }

    //all values are in %
    private selectThumb(e: any){
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

    //all values are in %
    private selectThumbRangeFalse(newThumbCurrentPercent: number){
        // this.view.selectObject = this.view.sliderThumb;
        // this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent);
        this.view.selectObject = this.view.sliderThumb;
        this.changeThumbInModel(newThumbCurrentPercent);
        this.view.selectObject = {};
    }

    //all values are in %
    private selectThumbRangeTrue(newThumbCurrentPercent: number){
        let firstThumbPercent: number = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent: number = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        let firstDiff: number = Math.abs(firstThumbPercent - newThumbCurrentPercent);
        let secondDiff: number = Math.abs(secondThumbPercent - newThumbCurrentPercent);

        if (firstDiff < secondDiff){ 
            this.view.selectObject = this.view.sliderThumb;
            this.changeThumbInModel(newThumbCurrentPercent); 
        } if (firstDiff > secondDiff){
            this.view.selectObject = this.view.sliderThumbSecond!;
            this.changeThumbSecondInModel(newThumbCurrentPercent);
        } if (firstDiff === secondDiff){
            (newThumbCurrentPercent < firstThumbPercent)
                ? (this.view.selectObject = this.view.sliderThumb,
                    this.changeThumbInModel(newThumbCurrentPercent))
                : (newThumbCurrentPercent > firstThumbPercent
                    ? (this.view.selectObject = this.view.sliderThumbSecond!,
                    this.changeThumbSecondInModel(newThumbCurrentPercent))
                    : null );
        }
        this.view.selectObject = {};
    }

    //all values are in %
    private dragThumb(e: any){
        let newThumbCurrentPX = this.ifHorizontal
            ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left
            : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
        let newThumbCurrent= this.ifHorizontal
                ? Math.floor(newThumbCurrentPX/this.containerSize*100)
                : Math.floor((this.containerSize - newThumbCurrentPX)/this.containerSize*100);
        let restrictedThumbCurrent = applyRestrictions(newThumbCurrent) 
        this.ifRange
                ? this.dragThumbRangeTrue(restrictedThumbCurrent)
                : this.dragThumbRangeFalse(restrictedThumbCurrent);
    }

    //all values are in %
    private dragThumbRangeFalse(newThumbCurrent: number){
        this.changeThumbInModel(newThumbCurrent);
    }

    //all values are in %
    private dragThumbRangeTrue(newThumbCurrent: number){
        let firstThumbPercent = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        if (this.view.dragObject === this.view.sliderThumb &&
            newThumbCurrent<= secondThumbPercent + 1){
            this.changeThumbInModel(newThumbCurrent);
        } 
        else if (this.view.dragObject === this.view.sliderThumbSecond &&
            newThumbCurrent>= firstThumbPercent + 1){
            this.changeThumbSecondInModel(newThumbCurrent);
        }
    }

    //value - %, newValue - actual
    private changeThumbInModel(value: number){
        //this.changeThumbs(value); //in percents
        let newValue = fromPercentsToValueApplyStep(value, this.max, this.min, this.step);
        this.model.changeThumb(newValue); //as value
    }

    //value - %, newValue - actual
    private changeThumbSecondInModel(value: number){
        let newValue = fromPercentsToValueApplyStep(value, this.max, this.min, this.step);
        this.model.changeThumbSecond(newValue);
    }

    //value - actual, newValue - %
    private changeThumbs(value: number){
        // //rewrite with eventDispatcher?
        let object = (this.view.dragObject.classList !== undefined)
            ? this.view.dragObject 
            : this.view.selectObject;

        //change thumbs in panel
        (object === this.view.sliderThumb)
            ? this.fromPresenterThumbUpdate.notify(value)
            : this.fromPresenterThumbSecondUpdate.notify(value);

        //change thumbs in view
        let newValue = changeValueToPercentsApplyStep(value, this.max, this.min, this.step);
        this.view.сhange(object, newValue);
    }

    // this part manages external changes

    setData(name: string, data: any){
        this.model.setData(name, data);
    }

    updateDataEverywhere(){
        this.updateView();
        this.fromPresenterUpdate.notify();
    }
}

export { IPresenter, SliderPresenter }