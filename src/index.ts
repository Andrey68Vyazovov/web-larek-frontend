import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppModel, CatalogChangeEvent, Product } from './components/AppData';
import { Page } from './components/common/Page';
import { Card, BasketCard } from './components/common/Card';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Contacts } from './components/Contacts';
import { Confirm } from './components/common/Сonfirm';
import { Delivery } from './components/Delivery';
import { IContactForm, IDeliveryForm, PaymentMethod } from './types';

// Все шаблоны
const confirmTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Брокер событий
const events = new EventEmitter();
// Модуль работы с сервером
const api = new LarekAPI(CDN_URL, API_URL);
// Модель данных приложения
const appData = new AppModel({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//  Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new Delivery(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

// Бизнес-логика

// изменились элементы каталога в модели данных
events.on<CatalogChangeEvent>('catalog:change', () => {
	page.catalog = appData.catalog.map((product) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:change', product),
		});
		return card.render({
			category: product.category,
			title: product.title,
			image: product.image,
			price: product.price,
		});
	});
	page.counter = appData.getOrderedProducts().length;
});

//
events.on('preview:change', (item: Product) => {
	if (item) {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.productOrdered(item)) {
					events.emit('product:delete', item);
				} else {
					events.emit('product:added', item);
				}
			},
		});
		modal.render({
			content: card.render({
				category: item.category,
				title: item.title,
				description: item.description,
				image: item.image,
				price: item.price,
				button: appData.productOrdered(item) ? 'Убрать' : 'Купить',
			}),
		});
	} else {
		modal.close();
	}
});

// товар добавлен в корзину
events.on('product:added', (item: Product) => {
	appData.addProduct(item);
	modal.close();
});

// товар удален из корзины
events.on('product:delete', (item: Product) => {
	appData.deleteProduct(item.id);
	modal.close();
});

// Открыть форму доставки
events.on('delivery:open', () => {
	deliveryForm.setClass('card');
	appData.setPaymentMethod('card');
	modal.render({
		content: deliveryForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// выбрана оплата
events.on('payment:changed', (data: { target: PaymentMethod }) => {
	appData.setPaymentMethod(data.target);
});

// Отправлена формы доставки
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму контактов
events.on('contacts:open', () => {
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы контактов
events.on('formContactsErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы доставки
events.on('formDeliveryError:change', (errors: Partial<IDeliveryForm>) => {
	const { payment, address } = errors;
	deliveryForm.valid = !payment && !address;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Изменился адрес доставки
events.on('order.address:change', (data: { value: string }) => {
	appData.setAddress(data.value);
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	appData.setOrder();
	api
		.orderProducts(appData.order)
		.then((result) => {
			const confirm = new Confirm(
				cloneTemplate(confirmTemplate),
				appData.order.total,
				{
					onClick: () => {
						modal.close();
					},
				}
			);
			modal.render({ content: confirm.render({}) });
			appData.resetBasket();
			deliveryForm.setClass('');
			events.emit('basket:change');
		})
		.catch((err) => {
			console.error(err);
		});
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// Изменились данные в корзине
events.on('basket:change', () => {
	page.counter = appData.getOrderedProducts().length;
	basket.items = appData.getOrderedProducts().map((product, index) => {
		const card = new BasketCard(cloneTemplate(cardBasketTemplate), index, {
			onClick: () => {
				appData.deleteProduct(product.id);
				basket.total = appData.getTotalOrder();
			},
		});
		return card.render({ title: product.title, price: product.price });
	});
	basket.total = appData.getTotalOrder();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем лоты с сервера, заполняем модель данных о катологе
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
