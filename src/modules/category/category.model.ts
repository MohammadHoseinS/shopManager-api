import { Expose, Type } from "class-transformer";

/**
 * Product category model, used for returning product category information
 * - In a real application should be moved to the common library used by the web app and api
 */
export class ProductCategory {
	@Expose()
	@Type(() => Number)
	id: number;

	@Expose()
	@Type(() => Date)
	createdOn: Date;

	@Expose()
	name: string;

	@Expose()
	description: string;

	@Expose()
	icon: string;

	@Expose()
	@Type(() => Number)
	totalItems: number;

	/************************* functions *************************/

	constructor(props?: Partial<ProductCategory>) {
		Object.assign(this, props);
	}
}