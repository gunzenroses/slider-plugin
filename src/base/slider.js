class Range {
    constructor(containerId){
        this.container = document.getElementById(containerId)
        this.data = []
        this.init()
    }

    init(){
        this.createChildren();
        this.render();
        this.enableHandlers();
        this.enableEventListeners();
        return this;
    }

    createChildren(){
        this.inputLeft = this.container.querySelector(".left_range");
        this.inputRight = this.container.querySelector(".right_range");
        this.thumbLeft = this.container.querySelector(".slider > .thumb.thumb_left");
        this.thumbRight = this.container.querySelector(".slider > .thumb.thumb_right");
        this.data = [parseInt(this.inputLeft.value), parseInt(this.inputRight.value)];
        this.range = this.container.querySelector(".slider >.range");
        this.rangeInfo = this.container.previousElementSibling;
        return this;
    }

    enableHandlers(){
        this.setLeftValueHandler = this.setLeftValue.bind(this);
        this.setRightValueHandler = this.setRightValue.bind(this);
        return this;
    }

    enableEventListeners(){
        this.inputLeft.addEventListener("input", this.setLeftValueHandler);
        this.inputRight.addEventListener("input", this.setRightValueHandler);
        return this;
    }

    setLeftValue(){
        let _this = this.inputLeft,
            min = parseInt(_this.min),
            max = parseInt(_this.max);
        _this.value = Math.min(parseInt(_this.value),parseInt(this.inputRight.value)+1);
        this.data[0] = _this.value;
        
        this.render();
        return this;
    }

    setRightValue(){
        let _this = this.inputRight,
            min = parseInt(_this.min),
            max = parseInt(_this.max);
        _this.value = Math.max(parseInt(_this.value),parseInt(this.inputLeft.value)+ 1);
        this.data[1] = _this.value;
        
        this.render();
        return this;
    }

    render(){
        
        this.leftPercent = this.data[0];
        this.rightPercent = this.data[1];
        
        this.thumbLeft.style.left = this.leftPercent + "%";
        this.range.style.left = this.leftPercent + "%";

        this.thumbRight.style.right= (100 - this.rightPercent) + "%";
        this.range.style.right= (100 - this.rightPercent) + "%";

        let highestPrice = parseInt(15000);
        let start = Math.ceil(this.data[0]/10000 * highestPrice)*100;
        
            let startBeginning = Math.floor(start/1000);
            let startFinish = start.toString().substr(startBeginning.toString().length,);
            let newStart = startBeginning + " " + startFinish + "₽";


        let end = Math.floor(this.data[1]/10000 * highestPrice)*100;
            let endBeginning = Math.floor(end/1000);
            let endFinish = end.toString().substr(endBeginning.toString().length,);
            let newEnd = endBeginning + " " + endFinish + "₽";

        this.rangeInfo.innerText = `${newStart} - ${newEnd}`;
        return this;
    }
}

export { Range }