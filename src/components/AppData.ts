import { Model } from './base/Model';
import { IEvents } from '../components/base/events';
import {
	FormErrors,
	IAppModel,
	IProduct,
	IOrder,
	IContactForm,
	PaymentMethod
} from '../types';

// тип для хранения элементов каталога для проверки их состояния брокером событий
export type CatalogChangeEvent = {
		catalog: Product[];
}

export class Product extends Model<IProduct> implements IProduct {
		id: string;
		description: string;
		image: string;
		title: string;
		category: string;
		price: number | null;
}

export class AppModel extends Model<IAppModel> {
		basket: IProduct[] = [];
		catalog: IProduct[] = [];
		order: IOrder = {
			payment: null,
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0
		};
		preview: string | null;
		formErrors: FormErrors = {};

	constructor(data: Partial<IAppModel>, protected events: IEvents) {
		super(data, events);
	}

	// добавление товара в корзину, вызов события
	addProduct(product: IProduct): void {
		this.basket.push(product);
		this.emitChanges('basket:change');
	}

	// удаление товара
	deleteProduct(id: string): void {
		this.basket = this.basket.filter((product) => product.id!==id);
		this.emitChanges('basket:change');
	}

	// сброс заказа
	resetOrder(): void {
		this.order = {
			payment: null,
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
		};
	}

	// сброс корзины
	resetBasket(): void {
		this.basket.length = 0; // новая запись, проверка
		this.resetOrder();
		this.emitChanges('basket:change');
	}

	// общая стоимость заказа
	getTotalOrder(): number {
		return this.basket.reduce((result, product) => result + product.price, 0);
	}

	// передать в модель данных массив товаров, запуск события изменения каталога товаров в модели данных
	setCatalog(products: IProduct[]): void {
		this.catalog = products.map((product)=> new Product(product, this.events));
		//console.log(this.catalog);
		this.emitChanges('catalog:change', { catalog: this.catalog });
	}

	// вернуть товары в корзине
	getOrderedProducts(): IProduct[] {
		return this.basket;
	}

	// проверить находится ли товар в корзине
	productOrdered(product: IProduct): boolean {
		return this.basket.includes(product);
	}

	// передать данные из корзины в заказ
	setOrder(): void {
		this.order.total = this.getTotalOrder();
		this.order.items = this.getOrderedProducts().map((product)=> product.id);
	}

	// проверить переданы ли в заказ способ оплаты и адрес
	validateDelivery(): void {
		const errors: FormErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formDeliveryError:change', this.formErrors);
	}

	// передать способ оплаты в заказ
	setPaymentMethod(method: PaymentMethod): void {
		this.order.payment = method;
		this.validateDelivery();
	}

	// проверить переданы ли контакты в заказ
	validateContacts(): void {
		const errors: FormErrors = {}; // новое написание проверить
		errors.email = !this.order.email?'Необходимо указать email':'';
		errors.phone = !this.order.phone?'Необходимо указать телефон':'';
		this.formErrors = errors;
		this.events.emit('formContactsErrors:change', this.formErrors);
	}

	// передать информацию о контактах в заказ
	setContactsField(field: keyof Partial<IContactForm>, value: string): void {
		this.order[field]=value;
		//console.log(this.order[field]);
		this.validateContacts();
	}

	// передать адрес доставки в модель данных
	setAddress(value: string): void {
		this.order.address = value;
		this.validateDelivery();
	}


}