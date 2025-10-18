import { ProductCategoryEntity } from "@database/entities/product-category";
import { ProductCategory } from "./category.model";

/**
 * Mapper class to map ProductCategoryEntity to ProductCategory model
 * - In a real application should be moved to the common library used by the web app and api
 */
export class ProductCategoryMapper {
	static async toModel(entity: ProductCategoryEntity): Promise<ProductCategory> {
		const totalItems = await entity.getTotalItems();
		return new ProductCategory({
			id: entity.id,
			createdOn: entity.createdOn,
			name: entity.name,
			description: entity.description,
			icon: entity.icon,
			totalItems
		});
	}
}