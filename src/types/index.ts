export type PaymentMethod = 'card' | 'cash';

// базовый тип для товара
export interface IBaseProduct {
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// типизация объекта с данными товара полученным от сервера
export type IProduct = IBaseProduct & {
	id: string;
}

// типизация данных заказа для отправки на сервер
export interface IContactForm {
	email: string;
	phone: string;
	address: string;
}

// типизация формы ввода формы оплаты и адреса
export interface IDeliveryForm {
	payment: PaymentMethod;
	address: string;
}

// типизация данных заказа для отправки на сервер
export type IOrder = IContactForm & {
		items: string[];
    payment: PaymentMethod | null;
		total: number;
	};

// типизация ответа сервера после отправки заказа
export interface IOrderResult {
	id: string;
	total: number | null;
}

// типизация ошибок при заполнении форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// типизация модели данных приложения
export interface IAppModel {
	catalog: IProduct[];
	preview: string | null;
	basket: string[];
	order: IOrder | null;
}