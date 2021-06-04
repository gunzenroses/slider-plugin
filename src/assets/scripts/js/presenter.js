//слой для обновления модели и отображения (Presenter).
// Это - единственный слой среди трех, который может иметь зависимость от других слоев.
// Он будет:
//реагировать на сообщения от отображения о действиях пользователей и обновлять модель;
//реагировать на сообщения об обновлении модели и обновлять отображение.

// class SliderPresenter {
//     constructor(model, view){
//         this.model = model
//         this.view = view
//         this.containerId = this.model.containerId
//         this.settings = this.model.settings
//         this.init();
//     }

//     init(){
//         this.view.init(this.containerId, this.settings);
//         this.createChildren();
//         this.setupHandlers();
//         this.enable();
//         this.renderView();
//         return this;
//     }

//     createChildren(){
//         //this.newThumbCurrentPX;
//         this.newThumbCurrent;
//         this.containerWidth = getComputedStyle(this.view.sliderContainer).width.replace("px","");
//         this.thumbWidth = getComputedStyle(this.view.sliderThumb).width.replace("px","");
//         return this;
//     }

//     setupHandlers(){
//         this.fromViewSelectThumbHandler = this.selectThumb.bind(this);
//         this.fromViewDragThumbHandler = this.dragThumb.bind(this);

//         this.fromModelChangeThumbHandler = this.changeThumbInView.bind(this);
//         return this;
//     }

//     enable(){
//         this.view.fromViewSelectThumb.add(this.fromViewSelectThumbHandler);
//         this.view.fromViewDragThumb.add(this.fromViewDragThumbHandler);

//         this.model.fromModelChangeThumb.add(this.fromModelChangeThumbHandler);
//         return this;
//     }

//     renderView(){
        
//     }

//     selectThumb(newCoord){
//         this.newThumbCurrentPosition = newCoord - this.thumbWidth/2;
//         let newThumbCurrentPercent = Math.floor(this.newThumbCurrentPosition/this.containerWidth*100);
//         if (!this.model.settings.range){ this.selectThumbRangeFalse(newThumbCurrentPercent)};
//         if (this.model.settings.range){ this.selectThumbRangeTrue(newThumbCurrentPercent)};
//         return;
//     }

//     selectThumbRangeFalse(newThumbCurrentPercent){
//         this.view.selectObject = this.view.sliderThumb;
//         this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent);
//         return this;
//     }

//     selectThumbRangeTrue(newThumbCurrentPercent){
//             let firstThumb = getComputedStyle(this.view.sliderThumb).left.replace("px","");
//             let secondThumb = getComputedStyle(this.view.sliderThumbSecond).left.replace("px","");
//             let firstThumbCoord = Math.round(firstThumb/this.containerWidth*100);
//             let secondThumbCoord = Math.floor(secondThumb/this.containerWidth*100);
//         let firstDiff = Math.abs(firstThumbCoord - newThumbCurrentPercent);
//         let secondDiff = Math.abs(secondThumbCoord - newThumbCurrentPercent);
//         if (firstDiff < secondDiff){ 
//             this.view.selectObject = this.view.sliderThumb;
//             this.changeThumbInModel(this.view.selectObject, newThumbCurrentPercent) 
//         } if (firstDiff > secondDiff){
//             this.view.selectObject = this.view.sliderThumbSecond;
//             this.changeThumbRightInModel(this.view.selectObject, newThumbCurrentPercent);
//         } if (firstDiff === secondDiff){
//             return;
//         }
//         return this;
//     }

//     dragThumb(e){
//         let thumbInnerShift = this.view.dragObject.offsetX;
//         let newThumbCurrentPX = e.clientX - thumbInnerShift;
//         this.newThumbCurrent = Math.floor(newThumbCurrentPX/this.containerWidth*100);
//         if (!this.model.settings.range){ return this.dragThumbRangeFalse(this.newThumbCurrent) }
//         else if (this.model.settings.range){ return this.dragThumbRangeTrue(this.newThumbCurrent) }
//         return this;
//     }

//     dragThumbRangeFalse(newThumbCurrent){
//         this.changeThumbInModel(this.view.dragObject.elem, newThumbCurrent);
//         return this;
//     }

//     dragThumbRangeTrue(newThumbCurrent){
//         if (!this.view.sliderThumb.style.left){
//             this.thumbPosition = parseInt(getComputedStyle(this.view.sliderThumb).left.replace("px","")/this.containerWidth*100)
//         } else {
//             this.thumbPosition = this.view.sliderThumb.style.left.replace("%","");
//         };
//         if (!this.view.sliderThumbSecond.style.left){
//             this.thumbSecondPosition = parseInt(getComputedStyle(this.view.sliderThumbSecond).left.replace("px","")/this.containerWidth*100);
//         } else {
//             this.thumbSecondPosition = this.view.sliderThumbSecond.style.left.replace("%","");
//         };
        

//         if (this.view.dragObject.elem === this.view.sliderThumb &&
//             this.newThumbCurrent > this.thumbSecondPosition){
//                 console.log(this.newThumbCurrent)
//                 console.log(this.thumbSecondPosition)
//             this.changeThumbInModel(this.view.dragObject.elem, this.newThumbCurrent);
//             return this;
//         } 
//         else if (this.view.dragObject.elem === this.view.sliderThumbSecond &&
//             this.newThumbCurrent < this.thumbPosition){
//             this.changeThumbRightInModel(this.view.dragObject.elem, this.newThumbCurrent);
//             return this;
//         } 
//         else {
//             //this.view.dragThumbEnd();
//             return this;
//         }
        
//     }

//             changeThumbInModel(object, newThumbValue){
//                 if (newThumbValue >= 0 && newThumbValue <= 100){
//                     this.model.fromPresenterChangeThumb(object, newThumbValue);
//                 }
//             }

//             changeThumbRightInModel(object, newThumbValue){
//                 if (newThumbValue >= 0 && newThumbValue <= 100){
//                     this.model.fromPresenterChangeThumbRight(object, newThumbValue);
//                 }
//             }

//     changeThumbInView(args){
//         console.log(args)
//         this.view.fromPresenterChangeThumb(args.object, args.newThumbValue);
//         this.view.fromPresenterChangeRange(args.object, args.newThumbValue);
//         return this;
//     }
// }

// export { SliderPresenter }