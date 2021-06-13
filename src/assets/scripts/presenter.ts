import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyStep, findPosition } from "./common"

interface Presenter {
    model: IModel;
    view: IView;
    containerId: string;
    settings: TSettings;

    init(): object;
    setupHandlers(): object;
    createChildren(): object;
    enable(): object;
}

class SliderPresenter implements Presenter {
    model:IModel;
    view: IView;
    containerId: string;
    settings: TSettings;

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

    fromViewSelectThumbHandler!: { (newCoord: number): object | undefined };
    fromViewDragThumbHandler!: { (ev: MouseEvent): object | undefined };
    fromModelChangeViewHandler!: { (args: {object: object, newThumbValue: number})
                                    : object | undefined };

    constructor(model: IModel, view: IView){
        this.model = model
        this.view = view
        this.containerId = this.model.containerId
        this.settings = this.model.settings
        this.init();
    }

    init(){
        this.view.init(this.containerId, this.settings);
        this.createChildren();
        this.setupHandlers();
        this.enable();
        return this;
    }

    createChildren(){
        this.max = this.settings.max;
        this.step = this.settings.step;
        this.ifHorizontal = this.settings.orientation === "horizontal";
        this.ifRange = this.settings.range;
        this.step = this.settings.step;
        this.containerSize = (this.ifHorizontal)
                            ? parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px",""))
                            : parseInt(getComputedStyle(this.view.sliderContainer).height.replace("px",""));
        this.thumbWidth = parseInt(getComputedStyle(this.view.sliderThumb).width.replace("px",""));
        return this;
    }

    setupHandlers(){
        this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
        this.fromViewDragThumbHandler = this.dragThumb.bind(this);
        this.fromModelChangeViewHandler = this.changeView.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
        this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);
        this.model.fromModelChangeView.add(this.fromModelChangeViewHandler);
        return this;
    }

    selectThumb(e: any){
        this.newThumbCurrentPosition = this.ifHorizontal
                    ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left + this.thumbWidth/2
                    : e.clientY - this.view.sliderContainer.getBoundingClientRect().top //+ this.thumbWidth/2;
        let newThumbCurrentPercent = this.ifHorizontal
                    ? Math.floor(this.newThumbCurrentPosition/this.containerSize*100)
                    : Math.floor((this.containerSize - this.newThumbCurrentPosition)/this.containerSize*100);
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
        let firstThumbCoord: number = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        let secondThumbCoord: number = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        let firstDiff: number = Math.abs(firstThumbCoord - newThumbCurrentPercent);
        let secondDiff: number = Math.abs(secondThumbCoord - newThumbCurrentPercent);

        if (firstDiff < secondDiff){ 
            this.view.selectObject = this.view.sliderThumb;
            this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent) 
        } if (firstDiff > secondDiff){
            this.view.selectObject = this.view.sliderThumbSecond!;
            this.changeThumbRightInModel(this.view.selectObject, newThumbCurrentPercent);
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
        this.newThumbCurrent = this.ifHorizontal
                ? Math.floor(newThumbCurrentPX/this.containerSize*100)
                : Math.floor((this.containerSize - newThumbCurrentPX)/this.containerSize*100);
        this.ifRange
                ? this.dragThumbRangeTrue(this.newThumbCurrent)
                : this.dragThumbRangeFalse(this.newThumbCurrent);
        return this;
    }

    dragThumbRangeFalse(newThumbCurrent: number){
        this.changeThumbInModel(this.view.dragObject.elem, newThumbCurrent);
        return this;
    }

    dragThumbRangeTrue(newThumbCurrent: number){
        this.thumbPosition = findPosition(this.view.sliderThumb, this.ifHorizontal, this.containerSize);
        this.thumbSecondPosition = findPosition(this.view.sliderThumbSecond!, this.ifHorizontal, this.containerSize);

        if (this.view.dragObject.elem === this.view.sliderThumb &&
            this.newThumbCurrent <= this.thumbSecondPosition + 1 &&
            this.newThumbCurrent >= 0 ){
            this.changeThumbInModel(this.view.dragObject.elem, newThumbCurrent);
            return this;
        } 
        else if (this.view.dragObject.elem === this.view.sliderThumbSecond &&
            this.newThumbCurrent >= this.thumbPosition + 1 &&
            this.newThumbCurrent <= 100){
            this.changeThumbRightInModel(this.view.dragObject.elem, newThumbCurrent);
            return this;
        } 
        else {
            //this.view.dragThumbEnd();
            return this;
        }
        
    }

            changeThumbInModel(object: object, newThumbValue: number){
                let temp = applyStep(newThumbValue, this.max, this.step);
                let newValue = temp > 100
                    ? 100
                    : temp < 0
                        ? 0
                        : temp;
                this.model.fromPresenterChangeThumb(object, newValue);
            }

            changeThumbRightInModel(object: object, newThumbValue: number){
                let temp = applyStep(newThumbValue, this.max, this.step);
                let newValue = temp > 100
                    ? 100
                    : temp < 0
                        ? 0
                        : temp;
                this.model.fromPresenterChangeThumbRight(object, newValue);
                return this;
            }

    changeView(args: {object: object, newThumbValue: number}){
        this.view.fromPresenterChange(args.object, args.newThumbValue);
        this.view.selectObject = {};
        return this;
    }
}

export { SliderPresenter }