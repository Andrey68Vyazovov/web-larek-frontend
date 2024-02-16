import { Component } from '../base/Component';
import { IBaseProduct } from '../../types/index';
import { ensureElement, formatNumber } from '../../utils/utils';
import { cardCategory } from '../../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// типизация карточки товара для рендера на странице
export type ICard = IBaseProduct & {
	button?: string;
	description?: string;
};

export class Card extends Component<ICard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button?: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;

	constructor(
		protected element: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._category = ensureElement<HTMLElement>(
			`.${element}__category`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${element}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${element}__image`,
			container
		);
		this._button = container.querySelector(`.${element}__button`);
		this._price = ensureElement<HTMLElement>(`.${element}__price`, container);
		this._description = container.querySelector(`.${element}__text`);
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(`card__category${cardCategory[value]}`);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, `${formatNumber(value)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this._button.setAttribute('disabled', '');
			}
		}
	}

	get price(): number {
		return Number(this._price.textContent);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}

export interface ICardBasket {
	title: string;
	price: number;
}

export class BasketCard extends Component<ICardBasket> {
	protected _number: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _buttonDelete: HTMLButtonElement;

	constructor(container: HTMLElement, num: number, actions?: ICardActions) {
		super(container);
		this.setText(this._number, num + 1);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._buttonDelete = ensureElement<HTMLButtonElement>(
			`.card__button`,
			container
		);
		this._buttonDelete.addEventListener('click', (event: MouseEvent) => {
			event.preventDefault();
			actions.onClick(event);
		});
		this._number = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this.setText(this._number, num + 1);
	}

	set index(value: number) {
		this.setText(this._number, value + 1);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		value
			? this.setText(this._price, `${formatNumber(value)} синапсов`)
			: this.setText(this._price, 'Бесценно');
	}

	render(data: ICardBasket): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
