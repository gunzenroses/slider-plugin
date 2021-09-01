import { IPresenter } from "mvp/presenter";
import { TSettings } from "utils/types";
interface IPanel {
    presenter: IPresenter;
    panelContainer: HTMLElement;
    data: TSettings;
    init(): void;
    render(data: TSettings): void;
    changePanel(event: Event): void;
    updatePanel(): void;
}
declare class ConfigurationPanel implements IPanel {
    presenter: IPresenter;
    panelContainer: HTMLElement;
    private parentContainer;
    private panelItems;
    data: TSettings;
    private listOfPanelItems;
    private minInput;
    private maxInput;
    private stepInput;
    private currentFirstInput;
    private currentSecondInput;
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
    constructor(container: HTMLElement, presenter: IPresenter);
    init(): void;
    private assignData;
    private createChildren;
    private setupHandlers;
    private enable;
    updatePanel(): void;
    private updateThumb;
    private updateThumbSecond;
    private updateStep;
    private updateMin;
    private updateMax;
    changePanel(e: Event): void;
    private assignChangingObject;
    private modelData;
    render(data: TSettings): void;
    private createPanelItem;
    private panelItemName;
    private panelItemInput;
    private selectOptions;
}
export { IPanel, ConfigurationPanel };
