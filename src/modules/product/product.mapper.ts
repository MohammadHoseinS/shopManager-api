import { ProductEntity } from "@database/entities/product";
import { Product } from "./product.model";
import { ProductCategoryMapper } from "@modules/category/category.mapper";

/**
 * Mapper class to map ProductEntity to Product model
 * - In a real application should be moved to the common library used by the web app and api
 */
export class ProductMapper {
	static toModel(entity: ProductEntity): Product {
		return new Product({
			id: entity.id,
			createdOn: entity.createdOn,
			name: entity.name,
			description: entity.description,
			price: entity.price,
		})
	}

	static async toModelWithDetails(entity: ProductEntity): Promise<Product> {
		const category = await entity.category;
		const categoryModel = await ProductCategoryMapper.toModel(category);
		return new Product({
			id: entity.id,
			createdOn: entity.createdOn,
			category: categoryModel,
			name: entity.name,
			description: entity.description,
			price: entity.price,
			stock: entity.stock
		});
	}
}