import { IPresenter } from "../mvp/presenter";
import { TSettings } from "../types/types";
interface IPanel {
    presenter: IPresenter;
    parentContainer: HTMLElement;
    data: TSettings;
    init(): void;
    render(data: TSettings): void;
    changePanel(event: Event): void;
    updatePanel(): void;
    updateThumb(): void;
    updateThumbSecond(): void;
}
declare class ConfigurationPanel implements IPanel {
    presenter: IPresenter;
    parentContainer: HTMLElement;
    data: TSettings;
    panelContainer: HTMLElement;
    panelItems: HTMLElement;
    private listOfPanelItems;
    checkboxes: NodeListOf<HTMLElement>;
    minInput: HTMLInputElement;
    maxInput: HTMLInputElement;
    stepInput: HTMLInputElement;
    currentFirstInput: HTMLInputElement;
    currentSecondInput: HTMLInputElement;
    orientationInput: HTMLInputElement;
    numberInputs: NodeListOf<Element>;
    updateHandler: {
        (data: TSettings): void;
    };
    changePanelHandler: {
        (event: Event): void;
    };
    updateThumbHandler: {
        (number: number): void;
    };
    updateThumbSecondHandler: {
        (number: number): void;
    };
    constructor(containerId: string, presenter: IPresenter);
    private getData;
    init(): void;
    private createChildren;
    private setupHandlers;
    private enable;
    updatePanel(): void;
    updateThumb(): void;
    updateThumbSecond(): void;
    changePanel(e: Event): void;
    render(data: TSettings): void;
    private createPanelItem;
    private selectOption;
}
export { ConfigurationPanel };
