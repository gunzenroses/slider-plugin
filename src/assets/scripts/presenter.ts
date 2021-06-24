import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyStep, applyRestrictions, findPosition } from "./common"

interface Presenter {
    model: IModel;
    view: IView;
    containerId: string;
    data: TSettings;

    init(): object;
    setupHandlers(): object;
    createChildren(): object;
    enable(): object;
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

    fromModelChangeViewHandler!: { (args: {object: object, newThumbValue: number})
                                    : object | undefined };
    fromViewSortActionsHandler!: {(args: {flag: string, event: Event}) : void};

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
        this.step = this.data.step;
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

    sortThumbActions(args: any){
        if (args.flag = 'selectThumb'){ this.selectThumb(args.e); } 
        else if (args.flag = 'dragThumbMove'){ this.dragThumb(args.e); }
        return this;
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
        return this;
    }

    selectThumbRangeFalse(newThumbCurrentPercent: number){
        this.view.selectObject = this.view.sliderThumb;
        this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent);
        return this;
    }

    selectThumbRangeTrue(newThumbCurrentPercent: number){
        let firstThumbPercent: number = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent: number = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        let firstDiff: number = Math.abs(firstThumbPercent - newThumbCurrentPercent);
        let secondDiff: number = Math.abs(secondThumbPercent - newThumbCurrentPercent);

        if (firstDiff < secondDiff){ 
            this.view.selectObject = this.view.sliderThumb;
            this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent) 
        } if (firstDiff > secondDiff){
            this.view.selectObject = this.view.sliderThumbSecond!;
            this.changeThumbSecondInModel(this.view.selectObject, newThumbCurrentPercent);
        } if (firstDiff === secondDiff){
            return;
        }
        return this;
    }

    dragThumb(e: MouseEvent){
        // let thumbInnerShift: number = parseInt(this.view.dragObject.offset);
        let newThumbCurrentPX = this.ifHorizontal
            ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left
            : e.clientY - this.view.sliderContainer.getBoundingClientRect().top;
        let newThumbCurrent= this.ifHorizontal
                ? Math.floor(newThumbCurrentPX/this.containerSize*100)
                : Math.floor((this.containerSize - newThumbCurrentPX)/this.containerSize*100);
        this.ifRange
                ? this.dragThumbRangeTrue(newThumbCurrent)
                : this.dragThumbRangeFalse(newThumbCurrent);
        return this;
    }

    dragThumbRangeFalse(newThumbCurrent: number){
        this.changeThumbInModel(this.view.dragObject.elem, newThumbCurrent);
        return this;
    }

    dragThumbRangeTrue(newThumbCurrent: number){
        let firstThumbPercent = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbPercent = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        if (this.view.dragObject.elem === this.view.sliderThumb &&
            newThumbCurrent<= secondThumbPercent + 1 &&
            newThumbCurrent>= 0 ){
            this.changeThumbInModel(this.view.dragObject.elem, newThumbCurrent);
            return this;
        } 
        else if (this.view.dragObject.elem === this.view.sliderThumbSecond &&
            newThumbCurrent>= firstThumbPercent + 1 &&
            newThumbCurrent<= 100){
            this.changeThumbSecondInModel(this.view.dragObject.elem, newThumbCurrent);
            return this;
        } 
        else {
            //this.view.dragThumbEnd();
            return this;
        }
        
    }

            changeThumbInModel(object: object, newThumbValue: number){
                let newValue = applyRestrictions(applyStep(newThumbValue, this.max, this.min, this.step));
                this.model.changeThumb(object, newValue);
            }

            changeThumbSecondInModel(object: object, newThumbValue: number){
                let newValue = applyRestrictions(applyStep(newThumbValue, this.max, this.min, this.step));
                this.model.changeThumbSecond(object, newValue);
                return this;
            }

    changeView(args: {object: object, newThumbValue: number}){
        this.view.fromPresenterChange(args.object, args.newThumbValue);
        this.view.selectObject = {};
        return this;
    }
}

export { SliderPresenter }