import { appendCustomElement } from "utils/common";

export default class checkValidity {
  private item: HTMLInputElement;
  private messageContainer!: HTMLElement;
  private parentContainer: HTMLElement;
  invalidities: Array<string>;

  constructor(item: HTMLInputElement, parentContainer: HTMLElement) {
    this.item = item;
    this.parentContainer = parentContainer;
    this.messageContainer = appendCustomElement("div", "error-message", this.parentContainer);
    this.invalidities = [];
    this.checkValidity();
  }

  checkValidity(): void {
    const validity = this.item.validity;
    if (this.item.value === "") {
      this.addInvalidity("Should be a number");
    }

    if (validity.rangeOverflow) {
      const max = this.item.getAttribute("max");
      this.addInvalidity("Number should be maximum " + max);
    }

    if (validity.rangeUnderflow) {
      const min = this.item.getAttribute("min");
      this.addInvalidity("Number should be minimum " + min);
    }

    if (validity.stepMismatch) {
      const step = this.item.getAttribute("step");
      const min = this.item.getAttribute("min");
      if (min === null) {
        this.addInvalidity(`Number should be multiple of ${step}`);
      } else {
        this.addInvalidity(`Number should be: ${min} + multiple of ${step}`);
      }
    }

    if (this.item.checkValidity() === false) {
      this.placeValidityMessages();
    }
  }

  private addInvalidity(message: string): void {
    this.invalidities.push(message);
  }

  private getInvalidities(): string {
    return this.invalidities.join(". \n");
  }

  private placeValidityMessages(): void {
    const msg = this.getInvalidities();
    this.messageContainer.classList.remove("hidden");
    this.messageContainer.innerText = msg;
    setTimeout(() => {
      this.deleteValidityMessage();
    }, 1500);
  }

  private deleteValidityMessage(): void {
    this.invalidities = [];
    this.messageContainer.innerText = "";
    this.messageContainer.classList.add("hidden");
  }
}
