import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPage {
	counter: number|null;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _pageWrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket.addEventListener('click', () => this.events.emit('basket:open'))
	}

	set counter(value: number){
		this.setText(this._counter, value);
	}

	set catalog(products: HTMLElement[]) {
		this._catalog.replaceChildren(...products);
	}

	set locked(value: boolean){
		value?
		this._pageWrapper.classList.add('page__wrapper_locked'):
		this._pageWrapper.classList.remove('page__wrapper_locked');
	}
}