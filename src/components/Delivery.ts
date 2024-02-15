import { Form } from './common/Form';
import { IDeliveryForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Delivery extends Form<IDeliveryForm> {
  protected _paymentBox: HTMLDivElement;
  protected _paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentBox = ensureElement<HTMLDivElement>('.order__button', this.container);
		this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
		this._paymentButtons.forEach(elem => elem.addEventListener('click', (event: MouseEvent) => {
			const target = event.target as HTMLButtonElement;
			const name = target.name;
			this.setClass(name);
			events.emit('payment:changed', {target: name});
		}));
	}

	setClass(name: string): void {
		this._paymentButtons.forEach((button) => {
			button.name === name?
			button.classList.add('button_alt-active'):
			button.classList.remove('button_alt-active');
		})
	}

	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = address;
	}

}