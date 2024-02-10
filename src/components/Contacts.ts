import { Form } from './common/Form';
import { IContactForm } from '../types';
import { IEvents } from './base/events';

export class Contacts extends Form<IContactForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

}