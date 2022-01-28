import { appendCustomElement } from 'utils/common';

class CheckValidity {
  private item: HTMLInputElement;

  private messageContainer!: HTMLElement;

  private parentContainer: HTMLElement;

  invalidities: Array<string>;

  constructor(item: HTMLInputElement, parentContainer: HTMLElement) {
    this.item = item;
    this.parentContainer = parentContainer;
    this.messageContainer = appendCustomElement(
      'div',
      'js-error-message',
      this.parentContainer
    );
    this.invalidities = [];
    this.checkValidity();
    this.checkMessages();
  }

  checkValidity(): void {
    const { validity, value } = this.item;
    const name = this.item.getAttribute('name');
    const min = this.item.getAttribute('min');
    const max = this.item.getAttribute('max');
    const step = this.item.getAttribute('step');

    if (value === '') {
      this.addInvalidity('Should be a number');
    }

    if (validity.rangeOverflow) {
      this.addInvalidity(`Number should be maximum ${ max }`);
    }

    if (validity.rangeUnderflow) {
      this.addInvalidity(`Number should be minimum ${ min }`);
    }

    if (validity.stepMismatch) {
      if (name !== 'from' && name !== 'to') return;
      if (min !== null && min !== '0') {
        this.addInvalidity(
          `Number should be: ${ min } + multiple of ${ step }`
        );
      } else {
        this.addInvalidity(`Number should be multiple of ${ step }`);
      }
    }
  }

  private checkMessages() {
    if (this.invalidities.length >= 1) {
      this.placeValidityMessages();
    }
  }

  private addInvalidity(message: string): void {
    this.invalidities.push(message);
  }

  private getInvalidities(): string {
    return this.invalidities.join('. \n');
  }

  private placeValidityMessages(): void {
    const msg = this.getInvalidities();
    this.messageContainer.classList.remove('js-hidden');
    this.messageContainer.innerText = msg;
    setTimeout(() => {
      this.deleteValidityMessage();
    }, 1500);
  }

  private deleteValidityMessage(): void {
    this.invalidities = [];
    this.messageContainer.innerText = '';
    this.messageContainer.classList.add('js-hidden');
  }
}

export default CheckValidity;
