import {Component} from "../base/Component";

interface IConfirm {
    total: number;
}

interface IConfirmActions {
    onClick: () => void;
}

export class Confirm extends Component<IConfirm> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, total: number, actions: IConfirmActions) {
        super(container);
    }
}