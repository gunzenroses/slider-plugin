import { appendCustomElement } from "utils/common";

export default class checkValidity {
  private item: HTMLInputElement;
  private messageContainer!: HTMLElement;
  private parentContainer: HTMLElement;
  invalidities: Array<String>;

  constructor(item: HTMLInputElement, parentContainer: HTMLElement) {
    this.item = item;
    this.parentContainer = parentContainer;
    this.messageContainer = appendCustomElement(
      "div",
      "error-message",
      this.parentContainer
    );
    this.invalidities = [];
    this.checkValidity();
  }

  checkValidity() {
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
      const min = parseInt(this.item.getAttribute("min")!);
      if (min === 0) {
        this.addInvalidity(`Number should be multiple of ${step}`);
      } else {
        this.addInvalidity(`Number should be: ${min} + multiple of ${step}`);
      }
    }

    if (this.item.checkValidity() === false) {
      this.placeValidityMessages();
    }
  }

  private addInvalidity(message: string) {
    this.invalidities.push(message);
  }

  private getInvalidities() {
    return this.invalidities.join(". \n");
  }

  private placeValidityMessages() {
    let msg = this.getInvalidities();
    this.messageContainer.classList.remove("hidden");
    this.messageContainer.innerText = msg;
    setTimeout(() => {
      this.deleteValidityMessage();
    }, 1500);
  }

  private deleteValidityMessage() {
    this.invalidities = [];
    this.messageContainer.innerText = "";
    this.messageContainer.classList.add("hidden");
  }
}
