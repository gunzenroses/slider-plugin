export default abstract class SliderElement {
  abstract init(...options: any): HTMLElement;
  abstract make(...options: any): HTMLElement;
  abstract change(...options: any): HTMLElement;
}
