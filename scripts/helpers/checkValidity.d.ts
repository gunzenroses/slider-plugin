export default class checkValidity {
    private item;
    private messageContainer;
    private parentContainer;
    invalidities: Array<string>;
    constructor(item: HTMLInputElement, parentContainer: HTMLElement);
    checkValidity(): void;
    private addInvalidity;
    private getInvalidities;
    private placeValidityMessages;
    private deleteValidityMessage;
}
