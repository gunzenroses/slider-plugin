import { appendCustomElement } from "Utils/common";

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
    this.checkMessages();
  }

  checkValidity(): void {
    const validity = this.item.validity;
    const value = this.item.value;
    const name = this.item.getAttribute("name");
    const min = this.item.getAttribute("min");
    const max = this.item.getAttribute("max");
    const step = this.item.getAttribute("step");

    if (value === "") {
      this.addInvalidity("Should be a number");
    }

    if ((name === "step") && (parseFloat(value) !== parseInt(value))) {
      this.addInvalidity("Should be an integer");
    }

    if (validity.rangeOverflow) {
      this.addInvalidity("Number should be maximum " + max);
    }

    if (validity.rangeUnderflow) {
      this.addInvalidity("Number should be minimum " + min);
    }

    if (validity.stepMismatch) {
      if (name === "step" || "max") return;
      if (min === null) return;
      this.addInvalidity(`Number should be: ${min} + multiple of ${step}`);
    }
  }

  private checkMessages() {
    this.invalidities.length >= 1 ? this.placeValidityMessages() : null;
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
