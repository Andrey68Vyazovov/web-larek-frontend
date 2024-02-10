import { Model } from './base/Model';
import { IEvents } from '../components/base/events';
import {
	Id,
	FormErrors,
	IAppModel,
	IProduct,
	IOrder,
	IContactForm,
	Price,
	PaymentMethod,
} from '../types';

export class Product extends Model<IProduct> implements IProduct {
	id: Id;
	description: string;
	image: string;
	title: string;
	category: string;
	status: boolean;
	price: Price;
}

export class AppModel extends Model<IAppModel> {
	basket: IProduct[];
	catalog: IProduct[];
	order: IOrder;
	preview: string | null;
	formErrors: FormErrors = {};

	constructor(data: Partial<IAppModel>, protected events: IEvents) {
	}

}