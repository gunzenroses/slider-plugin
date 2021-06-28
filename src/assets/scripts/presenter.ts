import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyStep, applyRestrictions, findPosition } from "./common"

interface Presenter {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;

    init(): void;
    sortThumbActions(flag: string, e: Event): void;
    selectThumb(e: any): void;
    dragThumb(e: MouseEvent): void;
    changeThumbInModel(object: object, value: number): void;
    changeThumbSecondInModel(object: object, value: number): void;
    changeView(object: object, value: number): void;
}

class SliderPresenter implements Presenter {
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

    fromModelChangeViewHandler!: { (object: object, newThumbValue: number) : void };
    fromViewSortActionsHandler!: {(flag: string, event: Event) : void };

    constructor(model: IModel, view: IView){
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
        this.view.selectObject.elem = this.view.sliderThumb;
        this.changeThumbInModel(this.view.selectObject.elem, newThumbCurrentPercent);
        this.view.changeThumbEnd();
    }

    selectThumbRangeTrue(newThumbCurrentPercent: number){
        let firstThumbPercent: number = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent: number = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        let firstDiff: number = Math.abs(firstThumbPercent - newThumbCurrentPercent);
        let secondDiff: number = Math.abs(secondThumbPercent - newThumbCurrentPercent);

        if (firstDiff < secondDiff){ 
            this.view.selectObject.elem = this.view.sliderThumb;
            this.changeThumbInModel(this.view.selectObject.elem, newThumbCurrentPercent) 
        } if (firstDiff >= secondDiff){
            this.view.selectObject.elem = this.view.sliderThumbSecond!;
            this.changeThumbSecondInModel(this.view.selectObject.elem, newThumbCurrentPercent);
        }
        this.view.changeThumbEnd();
    }

    dragThumb(e: any){
        // let thumbInnerShift: number = parseInt(this.view.selectObject.offset);
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
        this.changeThumbInModel(this.view.selectObject.elem, newThumbCurrent);
    }

    dragThumbRangeTrue(newThumbCurrent: number){
        let firstThumbPercent = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        if (this.view.selectObject.elem === this.view.sliderThumb &&
            newThumbCurrent<= secondThumbPercent + 1 &&
            newThumbCurrent>= 0 ){
            this.changeThumbInModel(this.view.selectObject.elem, newThumbCurrent);
            return this;
        } 
        else if (this.view.selectObject.elem === this.view.sliderThumbSecond &&
            newThumbCurrent>= firstThumbPercent + 1 &&
            newThumbCurrent<= 100){
            this.changeThumbSecondInModel(this.view.selectObject.elem, newThumbCurrent);
        } 
        else return;
    }

    changeThumbInModel(object: object, value: number){
        let newValue = applyRestrictions(applyStep(value, this.max, this.min, this.step));
        this.model.changeThumb(object, newValue);
    }

    changeThumbSecondInModel(object: object, value: number){
        let newValue = applyRestrictions(applyStep(value, this.max, this.min, this.step));
        this.model.changeThumbSecond(object, newValue);
    }

    changeView(object: object, value: number){
        this.view.сhange(object, value);
        //this.view.selectObject.elem = {};
    }
}

export { SliderPresenter }