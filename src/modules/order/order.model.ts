import { Customer } from "@modules/customer/customer.model";
import { Expose, Type } from "class-transformer";
import { OrderItem } from "./item/item.model";

export class Order {
	@Expose()
	@Type(() => Number)
	id: number;

	@Expose()
	@Type(() => Customer)
	customer: Customer;

	@Expose()
	@Type(() => Number)
	totalPrice: number;

	@Expose()
	description: string;

	@Expose()
	status: string;

	@Expose()
	@Type(() => Date)
	createdOn: Date;

	@Expose()
	@Type(() => Date)
	shippedOn: Date;

	@Expose()
	@Type(() => Date)
	finalizedOn: Date;

	@Expose()
	@Type(() => Date)
	canceledOn: Date;

	@Expose()
	@Type(() => OrderItem)
	items: OrderItem[];

	/************************* Methods *************************/

	constructor(props?: Partial<Order>) {
		Object.assign(this, props);
	}
}