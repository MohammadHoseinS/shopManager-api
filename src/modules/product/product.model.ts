import { ProductCategory } from "@modules/category/category.model";
import { Expose, Type } from "class-transformer";

/**
 * Product model, used for returning product information
 * - In a real application should be moved to the common library used by the web app and api
 */
export class Product {
	@Expose()
	@Type(() => Number)
	id: number;

	@Expose()
	@Type(() => Date)
	createdOn: Date;

	@Expose()
	@Type(() => ProductCategory)
	category: ProductCategory;

	@Expose()
	name: string;

	@Expose()
	description: string;

	@Expose()
	@Type(() => Number)
	price: number;

	@Expose()
	@Type(() => Number)
	stock: number;

	/************************* functions *************************/

	constructor(props?: Partial<Product>) {
		Object.assign(this, props);
	}
}