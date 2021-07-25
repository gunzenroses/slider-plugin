declare class checkValidity {
    private item;
    private messageContainer;
    private parentContainer;
    invalidities: Array<String>;
    constructor(item: HTMLInputElement, parentContainer: HTMLElement);
    checkValidity(): void;
    addInvalidity(message: string): void;
    getInvalidities(): string;
    placeValidityMessages(): void;
    deleteValidityMessage(): void;
}
export { checkValidity };
