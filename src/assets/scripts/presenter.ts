import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyStep, applyRestrictions, findPosition } from "./common"
import { ISender, EventDispatcher } from "./eventDispatcher"

interface IPresenter extends ISender {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;

    init(): void;
    sortThumbActions(flag: string, e: Event): void;
    selectThumb(e: any): void;
    dragThumb(e: MouseEvent): void;
    changeThumbInModel(value: number): void;
    changeThumbSecondInModel(value: number): void;
    changeView(value: number): void;
}

class SliderPresenter extends EventDispatcher implements IPresenter {
    model:IModel;
    view: IView;
    containerId: string;
    data: TSettings;

    min!:number;
    max!: number;
    step!: number;

    newThumbCurrent!: number;
    ifHorizontal!: boolean;
    ifRange!: boolean;
    containerSize!: number;
    thumbWidth!: number;
    newThumbCurrentPosition!: number;
    thumbPosition!: number;
    thumbSecondPosition!: number;

    fromModelChangeViewHandler!: { (newThumbValue: number) : void };
    fromViewSortActionsHandler!: {(flag: string, event: Event) : void };

    constructor(model: IModel, view: IView){
        super()
        this.model = model
        this.view = view
        this.containerId = this.model.getContainerId()
        this.data = this.model.getData()
        this.init();
    }

    init(){
        this.view.init(this.data);
        this.createChildren();
        this.setupHandlers();
        this.enable();
        return this;
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
        return this;
    }

    setupHandlers(){
        this.fromViewSortActionsHandler = this.sortThumbActions.bind(this);
        this.fromModelChangeViewHandler = this.changeView.bind(this);
        return this;
    }

    enable(){
        this.view.add(this.fromViewSortActionsHandler);
        this.model.add(this.fromModelChangeViewHandler);
        this.add(this.view.changeHandler);
        return this;
    }

    sortThumbActions(flag: string, e: Event){
        if (flag === 'selectThumb'){ this.selectThumb(e);} 
        else if (flag === 'dragThumb'){ this.dragThumb(e);}
    }

    selectThumb(e: any){
        let newThumbCurrentPosition = this.ifHorizontal
                    ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left + this.thumbWidth/2
                    : e.clientY - this.view.sliderContainer.getBoundingClientRect().top //+ this.thumbWidth/2;
        let newThumbCurrentPercent = this.ifHorizontal
                    ? Math.floor(newThumbCurrentPosition/this.containerSize*100)
                    : Math.floor((this.containerSize - newThumbCurrentPosition)/this.containerSize*100);
        this.ifRange 
            ? this.selectThumbRangeTrue(newThumbCurrentPercent)
            :  this.selectThumbRangeFalse(newThumbCurrentPercent);
    }

    selectThumbRangeFalse(newThumbCurrentPercent: number){
        // this.view.selectObject = this.view.sliderThumb;
        // this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent);
        this.view.selectObject = this.view.sliderThumb;
        this.changeThumbInModel(newThumbCurrentPercent);
        this.view.dragThumbEnd();
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
        this.view.dragThumbEnd();
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
        this.changeThumbInModel(newThumbCurrent);
    }

    dragThumbRangeTrue(newThumbCurrent: number){
        let firstThumbPercent = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        if (this.view.selectObject === this.view.sliderThumb &&
            newThumbCurrent<= secondThumbPercent + 1 &&
            newThumbCurrent>= 0 ){
            this.changeThumbInModel(newThumbCurrent);
            return this;
        } 
        else if (this.view.selectObject === this.view.sliderThumbSecond &&
            newThumbCurrent>= firstThumbPercent + 1 &&
            newThumbCurrent<= 100){
            this.changeThumbSecondInModel(newThumbCurrent);
        } 
        else return;
    }

    changeThumbInModel(value: number){
        let newValue = applyRestrictions(applyStep(value, this.max, this.min, this.step));
        this.model.changeThumb(newValue);
    }

    changeThumbSecondInModel(value: number){
        let newValue = applyRestrictions(applyStep(value, this.max, this.min, this.step));
        this.model.changeThumbSecond(newValue);
    }

    changeView(value: number){
        //this.view.сhange(value);
        this.notify(value);
    }
}

export { IPresenter, SliderPresenter }