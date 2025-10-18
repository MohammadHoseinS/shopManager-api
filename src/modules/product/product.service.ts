import { IPaginationRequest } from "@common/interfaces";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProductFilterDto, ProductSubmitDto } from "./product.dto";
import { ProductEntity } from "@database/entities/product";
import { ProductCategoryEntity } from "@database/entities/product-category";

@Injectable()
export class ProductService {
	constructor(private readonly dataSource: DataSource) { }

	async load(pagination: IPaginationRequest<ProductFilterDto>): Promise<[ProductEntity[], number]> {
		const { limit: take, skip, params: { categories, name } } = pagination;

		const query = this.dataSource
			.createQueryBuilder(ProductEntity, 'product')
			.take(take)
			.skip(skip);

		if (categories?.length) {
			query.andWhere('product.categoryId IN (:...categories)', { categories });
		}

		if (name) {
			query.andWhere('product.name LIKE :name', { name: `%${name}%` });
		}

		return await query.getManyAndCount();
	}

	async create(category: ProductCategoryEntity, dto: ProductSubmitDto): Promise<ProductEntity> {
		return await this.dataSource.manager.save(ProductEntity, {
			categoryId: category.id,
			category: Promise.resolve(category),
			name: dto.name,
			description: dto.description,
			price: dto.price,
			stock: dto.stock
		});
	}

	async update(product: ProductEntity, dto: ProductSubmitDto): Promise<ProductEntity> {
		product.name = dto.name;
		product.description = dto.description;
		product.price = dto.price;
		product.stock = dto.stock;
		return await this.dataSource.manager.save(product);
	}

	async delete(product: ProductEntity): Promise<boolean> {
		const result = await this.dataSource.manager.softDelete(ProductEntity, product.id);
		return result?.affected > 0;
	}
}