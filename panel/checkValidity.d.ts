declare class checkValidity {
    private item;
    private messageContainer;
    private parentContainer;
    invalidities: Array<String>;
    constructor(item: HTMLInputElement, parentContainer: HTMLElement);
    checkValidity(): void;
    private addInvalidity;
    private getInvalidities;
    private placeValidityMessages;
    private deleteValidityMessage;
}
export { checkValidity };
