import { Api, ApiListResponse } from './base/api';
import { IOrder, IProduct, IOrderResult } from "../types";

export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string; // кэширование изображений полученных с сервера

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); //вызов конструктора Api
        this.cdn = cdn;
    }

    // запрос продукта по Id
    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`)
        .then(( product: IProduct) => ({
            ...product,
            image: this.cdn + product.image})
        )
    }
    // запрос списка продуктов с сервера
    getProductList(): Promise<IProduct[]> {
        return this.get(`/product`)
        .then((data: ApiListResponse<IProduct>) =>
            data.items.map((product)=> ({
                    ...product,
                    image: this.cdn + product.image})
        ))
    }
    // отправка информации о заказе на сервер
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        )
    }


}
