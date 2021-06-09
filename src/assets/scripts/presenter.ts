import { IModel } from "./model"
import { IView } from "./view"
import { TSettings } from "./types/types"
import { applyStep } from "./common"

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
                            : parseInt(getComputedStyle(this.view.sliderContainer).height.replace("px",""))
        //this.containerWidth = parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px",""));
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
                    : e.clientY - this.view.sliderContainer.getBoundingClientRect().top + this.thumbWidth/2;
        let newThumbCurrentPercent = Math.floor(this.newThumbCurrentPosition/this.containerSize*100);
        this.ifRange 
            ? this.selectThumbRangeTrue(newThumbCurrentPercent)
            :  this.selectThumbRangeFalse(newThumbCurrentPercent);
        return this;
    }

    selectThumbRangeFalse(newThumbCurrentPercent: number){
        this.view.selectObject = this.view.sliderThumb;
        let newValue = (newThumbCurrentPercent % this.step === 0 || newThumbCurrentPercent === this.settings.max)
                ? newThumbCurrentPercent
                : Math.round(newThumbCurrentPercent/this.step)*this.step;
        this.changeThumbInModel(this.view.selectObject, newValue);
        return this;
    }

    selectThumbRangeTrue(newThumbCurrentPercent: number){
            let newValue = (newThumbCurrentPercent % this.step === 0 || newThumbCurrentPercent === this.settings.max)
                ? newThumbCurrentPercent
                : Math.round(newThumbCurrentPercent/this.step)*this.step;
            let firstThumb: number = this.ifHorizontal
                        ? parseInt(getComputedStyle(this.view.sliderThumb).left.replace("px",""))
                        : parseInt(getComputedStyle(this.view.sliderThumb).top.replace("px",""));

            let secondThumb: number = this.ifHorizontal
                        ? parseInt(getComputedStyle(this.view.sliderThumbSecond!).left.replace("px",""))
                        : parseInt(getComputedStyle(this.view.sliderThumbSecond!).top.replace("px",""));

            let firstThumbCoord = Math.round(firstThumb/this.containerSize*100);
            let secondThumbCoord = Math.floor(secondThumb/this.containerSize*100);

        let firstDiff: number = Math.abs(firstThumbCoord - newThumbCurrentPercent);
        let secondDiff: number = Math.abs(secondThumbCoord - newThumbCurrentPercent);

        if (firstDiff < secondDiff){ 
            this.view.selectObject = this.view.sliderThumb;
            this.changeThumbInModel(this.view.selectObject, newValue) 
        } if (firstDiff > secondDiff){
            this.view.selectObject = this.view.sliderThumbSecond!;
            this.changeThumbRightInModel(this.view.selectObject, newValue);
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

        this.newThumbCurrent = Math.floor(newThumbCurrentPX/this.containerSize*100);

        if (!this.model.settings.range){ return this.dragThumbRangeFalse(this.newThumbCurrent) }
        else if (this.model.settings.range){ return this.dragThumbRangeTrue(this.newThumbCurrent) }
        return this;
    }

    dragThumbRangeFalse(newThumbCurrent: number){
        this.changeThumbInModel(this.view.dragObject.elem, newThumbCurrent);
        return this;
    }

    dragThumbRangeTrue(newThumbCurrent: number){
        if (this.ifHorizontal){
            (this.view.sliderThumb.style.left)
                ? this.thumbPosition =  parseInt(this.view.sliderThumb.style.left.replace("%",""))
                : this.thumbPosition = parseInt(getComputedStyle(this.view.sliderThumb).left.replace("px",""))/this.containerSize*100;

            (this.view.sliderThumbSecond!.style.left)
                ? this.thumbSecondPosition = parseInt(this.view.sliderThumbSecond!.style.left.replace("%",""))
                : this.thumbSecondPosition = parseInt(getComputedStyle(this.view.sliderThumbSecond!).left.replace("px",""))/this.containerSize*100;
        } else {
            (this.view.sliderThumb.style.top)
                ? this.thumbPosition =  parseInt(this.view.sliderThumb.style.top.replace("%",""))
                : this.thumbPosition = parseInt(getComputedStyle(this.view.sliderThumb).top.replace("px",""))/this.containerSize*100;

            (this.view.sliderThumbSecond!.style.top)
                ? this.thumbSecondPosition = parseInt(this.view.sliderThumbSecond!.style.top.replace("%",""))
                : this.thumbSecondPosition = parseInt(getComputedStyle(this.view.sliderThumbSecond!).top.replace("px",""))/this.containerSize*100;
        }   

        if (this.view.dragObject.elem === this.view.sliderThumb &&
            this.newThumbCurrent > this.thumbSecondPosition + 1 &&
            this.newThumbCurrent <= 100 ){
            this.changeThumbInModel(this.view.dragObject.elem, this.newThumbCurrent);
            return this;
        } 
        else if (this.view.dragObject.elem === this.view.sliderThumbSecond &&
            this.newThumbCurrent < this.thumbPosition - 1 &&
            this.newThumbCurrent >= 0 ){
            this.changeThumbRightInModel(this.view.dragObject.elem, this.newThumbCurrent);
            return this;
        } 
        else {
            //this.view.dragThumbEnd();
            return this;
        }
        
    }

            changeThumbInModel(object: object, newThumbValue: number){
                if (newThumbValue >= 0 && newThumbValue <= 100){
                    let newValue = applyStep(newThumbValue, this.max, this.step);
                    this.model.fromPresenterChangeThumb(object, newValue);
                }
                return this;
            }

            changeThumbRightInModel(object: object, newThumbValue: number){
                if (newThumbValue >= 0 && newThumbValue <= 100){
                    let newValue = applyStep(newThumbValue, this.max, this.step);
                    this.model.fromPresenterChangeThumbRight(object, newValue);
                }
                return this;
            }

    changeView(args: {object: object, newThumbValue: number}){
        this.view.fromPresenterChange(args.object, args.newThumbValue);
        this.view.selectObject = {};
        return this;
    }
}

export { SliderPresenter }