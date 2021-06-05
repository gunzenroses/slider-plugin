import { Model } from "./model"
import { IView } from "./view"
import { Settings } from "./types/types"

interface Presenter {
    model: Model;
    view: IView;
    containerId: string;
    settings: Settings;

    init(): object;
    setupHandlers(): object;
    createChildren(): object;
    enable(): object;
}


class SliderPresenter implements Presenter {
    model: Model;
    view: IView;
    containerId: string;
    settings: Settings;

    newThumbCurrent!: number;
    containerSize!: number;
    thumbWidth!: number;
    newThumbCurrentPosition!: number;
    thumbPosition!: number;
    thumbSecondPosition!: number;

    fromViewSelectThumbHandler!: { (newCoord: number): object | undefined };
    fromViewDragThumbHandler!: { (ev: MouseEvent): object | undefined };
    fromModelChangeThumbHandler!: { (args: {object: object, newThumbValue: number})
                                    : object | undefined };

    constructor(model: Model, view: IView){
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
        this.containerSize = (this.settings.orientation === "horizontal")
                            ? parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px",""))
                            : parseInt(getComputedStyle(this.view.sliderContainer).height.replace("px",""))
        //this.containerWidth = parseInt(getComputedStyle(this.view.sliderContainer).width.replace("px",""));
        this.thumbWidth = parseInt(getComputedStyle(this.view.sliderThumb).width.replace("px",""));
        return this;
    }

    setupHandlers(){
        this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
        this.fromViewDragThumbHandler = this.dragThumb.bind(this);
        this.fromModelChangeThumbHandler = this.changeThumbInView.bind(this);
        return this;
    }

    enable(){
        this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
        this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);

        this.model.fromModelChangeThumb.add(this.fromModelChangeThumbHandler);
        return this;
    }

    selectThumb(e: any){
        this.newThumbCurrentPosition = (this.settings.orientation === "horizontal")
                    ? e.clientX - this.view.sliderContainer.getBoundingClientRect().left - this.thumbWidth/2
                    : e.clientY - this.view.sliderContainer.getBoundingClientRect().top - this.thumbWidth/2;
        let newThumbCurrentPercent = Math.floor(this.newThumbCurrentPosition/this.containerSize*100);
        if (!this.model.settings.range){ this.selectThumbRangeFalse(newThumbCurrentPercent)};
        if (this.model.settings.range){ this.selectThumbRangeTrue(newThumbCurrentPercent)};
        return this;
    }

    selectThumbRangeFalse(newThumbCurrentPercent: number){
        this.view.selectObject = this.view.sliderThumb;
        this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent);
        return this;
    }

    selectThumbRangeTrue(newThumbCurrentPercent: number){
            let firstThumb: number = this.settings.orientation === "horizontal"
                        ? parseInt(getComputedStyle(this.view.sliderThumb).left.replace("px",""))
                        : parseInt(getComputedStyle(this.view.sliderThumb).top.replace("px",""));

            let secondThumb: number = this.settings.orientation === "horizontal"
                        ? parseInt(getComputedStyle(this.view.sliderThumbSecond!).left.replace("px",""))
                        : parseInt(getComputedStyle(this.view.sliderThumbSecond!).top.replace("px",""));

            let firstThumbCoord = Math.round(firstThumb/this.containerSize*100);
            let secondThumbCoord = Math.floor(secondThumb/this.containerSize*100);

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
        let thumbInnerShift: number = parseInt(this.view.dragObject.offsetX);
        let newThumbCurrentPX = e.clientX - thumbInnerShift;
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
        if (!this.view.sliderThumb.style.left){
            this.thumbPosition = parseInt(getComputedStyle(this.view.sliderThumb).left.replace("px",""))/this.containerSize*100;
        } else {
            this.thumbPosition =  parseInt(this.view.sliderThumb.style.left.replace("%",""));
        };
        if (!this.view.sliderThumbSecond.style.left){
            this.thumbSecondPosition = parseInt(getComputedStyle(this.view.sliderThumbSecond).left.replace("px",""))/this.containerSize*100;
        } else {
            this.thumbSecondPosition = parseInt(this.view.sliderThumbSecond.style.left.replace("%",""));
        };
        

        if (this.view.dragObject.elem === this.view.sliderThumb &&
            this.newThumbCurrent > this.thumbSecondPosition){
                // console.log(this.newThumbCurrent)
                // console.log(this.thumbSecondPosition)
            this.changeThumbInModel(this.view.dragObject.elem, this.newThumbCurrent);
            return this;
        } 
        else if (this.view.dragObject.elem === this.view.sliderThumbSecond &&
            this.newThumbCurrent < this.thumbPosition){
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
                    this.model.fromPresenterChangeThumb(object, newThumbValue);
                }
            }

            changeThumbRightInModel(object: object, newThumbValue: number){
                if (newThumbValue >= 0 && newThumbValue <= 100){
                    this.model.fromPresenterChangeThumbRight(object, newThumbValue);
                }
            }

    changeThumbInView(args: {object: object, newThumbValue: number}){
        this.view.fromPresenterChangeThumb(args.object, args.newThumbValue);
        this.view.fromPresenterChangeRange(args.object, args.newThumbValue);
        return this;
    }
}

export { SliderPresenter }