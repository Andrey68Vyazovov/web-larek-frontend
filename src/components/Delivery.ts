import { Form } from './common/Form';
import { IDeliveryForm } from '../types';
import { IEvents } from './base/events';

export class Delivery extends Form<IDeliveryForm> {
  protected _paymentBox: HTMLDivElement;
  protected _paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

	}

}