import { Component } from '../base/Component';
import { ensureElement, formatNumber } from '../../utils/utils';

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
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total.textContent = 'Списано ' + formatNumber(total) + ' синапсов';
		this._close.addEventListener('click', actions.onClick);
	}
}
