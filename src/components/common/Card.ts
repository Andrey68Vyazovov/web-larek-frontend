import { Component } from '../base/Component';
import { IBaseProduct } from '../../types/index';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// типизация карточки товара для рендера на странице
export type ICard = IBaseProduct & {
	button?: string;
}

export class Card extends Component<ICard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price: HTMLButtonElement;

	constructor( protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);
	}
}

export interface CardBasket {
	title: string;
	price: number;
}

export class BasketCard extends Component<CardBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _toDelete: HTMLButtonElement;

	constructor(container: HTMLElement, index: number, actions?: ICardActions) {
		super(container);
	}
}