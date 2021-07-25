
class checkValidity {
    private item: HTMLInputElement;
    private messageContainer!: HTMLElement;
    private parentContainer: HTMLElement;
    invalidities: Array<String>;
    
    constructor(item: HTMLInputElement, parentContainer: HTMLElement){
        this.item = item;
        this.parentContainer = parentContainer;
        this.messageContainer = document.createElement('div');
        this.messageContainer.classList.add('error-message');
        this.parentContainer.appendChild(this.messageContainer);
        this.invalidities = [];
        this.checkValidity();
    }

    checkValidity(){
        const validity = this.item.validity;
        if (this.item.value === ""){
            this.addInvalidity("Should be a number");
        }

        if (validity.typeMismatch){
            const type = this.item.getAttribute("type");
            this.addInvalidity("Number should be type " + type);
        }
        
        if (validity.rangeOverflow){
            const max = this.item.getAttribute("max");
            this.addInvalidity("Number should be maximum " + max);
        }

        if (validity.rangeUnderflow){
            const min = this.item.getAttribute("min");
            this.addInvalidity("Number should be minimum " + min);
        }

        if (validity.stepMismatch){
            const step  = this.item.getAttribute("step");
            const min = parseInt(this.item.getAttribute("min")!);
            if (min > 1){
                this.addInvalidity(`Number should be: ${min} + multiple of ${step}`);
            } else {
                this.addInvalidity(`Number should be multiple of ${step}`);
            }
        }

        if (this.item.checkValidity() === false){
            this.placeValidityMessages();
        }
    }

    addInvalidity(message: string){
        this.invalidities.push(message);
    }

    getInvalidities(){
        return this.invalidities.join('. \n');
    }

    placeValidityMessages(){
        let msg = this.getInvalidities();
        this.messageContainer.classList.remove('hidden');
        this.messageContainer.innerText = msg;
        setTimeout(()=>{ this.deleteValidityMessage()}, 1500);
    }

    deleteValidityMessage(){
        this.messageContainer.innerText = "";
        this.messageContainer.classList.add('hidden');
    }
}

export { checkValidity }