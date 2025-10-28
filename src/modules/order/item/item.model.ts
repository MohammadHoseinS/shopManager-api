import { Expose, Type } from "class-transformer";

export class OrderItem {
	@Expose()
	@Type(() => Number)
	id: number;

	@Expose()
	name: string;

	@Expose()
	@Type(() => Number)
	quantity: number;

	@Expose()
	@Type(() => Number)
	unitPrice: number;

	@Expose()
	@Type(() => Number)
	subtotal: number;

	/************************* Methods *************************/

	constructor(props?: Partial<OrderItem>) {
		Object.assign(this, props);
	}
}