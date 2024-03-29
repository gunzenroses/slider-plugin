import { boundMethod } from 'autobind-decorator';

class Tooltip {
  element!: HTMLElement;

  private className: string;

  constructor(data: TViewSettings, className: string) {
    this.className = className;
    this.init(data);
  }

  @boundMethod
  change(value: number): void {
    this.element.innerText = value.toString();
  }

  private init(data: TViewSettings): HTMLElement {
    const { currentFirst, currentSecond } = data;
    this.make(data);
    if (this.className === 'first') {
      this.change(currentFirst);
    } else {
      this.change(currentSecond);
    }
    return this.element;
  }

  private make(settings: TViewSettings): HTMLElement {
    const { ifHorizontal, tooltip } = settings;
    const verticalClass = ifHorizontal
      ? 'tooltip_horizontal'
      : 'tooltip_vertical';
    const typeName = `tooltip_${ this.className }`;
    const totalClass = tooltip
      ? ['tooltip', typeName, verticalClass]
      : ['tooltip', typeName, verticalClass, 'tooltip_disabled'];
    this.element = document.createElement('span');
    totalClass.forEach((item) => {
      this.element.classList.add(item);
    });
    this.element.dataset.name = 'tooltip';
    return this.element;
  }
}

export default Tooltip;
