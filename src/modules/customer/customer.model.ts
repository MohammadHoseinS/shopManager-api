import { Expose, Type } from "class-transformer";

export class Customer {
	@Expose()
	@Type(() => Number)
	id: number;

	@Expose()
	name: string;

	@Expose()
	email: string;

	@Expose()
	note: string;

	/************************* methods *************************/

	constructor(props?: Partial<Customer>) {
		Object.assign(this, props);
	}
}