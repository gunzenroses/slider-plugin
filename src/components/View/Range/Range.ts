import { boundMethod } from 'autobind-decorator';
import IView from 'interfaces/IView';

class Range {
  element!: HTMLElement;

  constructor(that: IView) {
    this.init(that);
  }

  private init(that: IView): HTMLElement {
    this.make(that);
    this.enable(that);
    this.change(that);
    that.track.append(this.element);
    return this.element;
  }

  private make(that: IView): HTMLElement {
    this.element = document.createElement("div");
    const elementClass: Array<string> = that.settings.ifHorizontal
      ? ["range"]
      : ["range", "range_vertical"];
    elementClass.forEach(item => this.element.classList.add(`${ item }`));
    return this.element;
  }

  private enable(that: IView): void {
    that.eventDispatcher.add("changeView", this.change);
  }
  
  @boundMethod
  private change(that: IView): void {
    if (that.settings.range) {
      this.changeFirst(that);
      this.changeSecond(that);
    } else {
      this.changeFirst(that);
    }
  }

  private changeFirst(that: IView): void {
    if (that.settings.range) {
      const position = that.settings.ifHorizontal ? "left" : "bottom";
      this.element.style[position] = `${that.settings.firstPosition}%`;
    } else {
      const position = that.settings.ifHorizontal ? "right" : "top";
      this.element.style[position] = `${100 - that.settings.firstPosition}%`;
    }
  }

  private changeSecond(that: IView): void {
    if (that.settings.ifHorizontal) {
      this.element.style.right = `${100 - that.settings.secondPosition}%`;
    } else {
      this.element.style.top = `${100 - that.settings.secondPosition}%`;
    }
  }
}

export default Range;
