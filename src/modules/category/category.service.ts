import { IPaginationRequest } from "@common/interfaces";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProductCategoryFilterDto, ProductCategorySubmitDto } from "./category.dto";
import { ProductCategoryEntity } from "@database/entities/product-category";
import { ProductEntity } from "@database/entities/product";

@Injectable()
export class ProductCategoryService {
	constructor(private readonly dataSource: DataSource) {}

	async getById(id: number): Promise<ProductCategoryEntity> {
		return await this.dataSource.manager.findOneBy(ProductCategoryEntity, { id });
	}

	async load(pagination: IPaginationRequest<ProductCategoryFilterDto>): Promise<[ProductCategoryEntity[], number]> {
		const { limit: take, skip, params: { name: title } } = pagination;

		const query = this.dataSource
			.createQueryBuilder(ProductCategoryEntity, 'category')
			.take(take)
			.skip(skip);

		if (title) {
			query.andWhere('category.name ILIKE :name', { name: `%${title}%` });
		}

		return await query.getManyAndCount();
	}

	async create(dto: ProductCategorySubmitDto): Promise<ProductCategoryEntity> {
		return await this.dataSource.manager.save(new ProductCategoryEntity({
			name: dto.name,
			description: dto.description
		}))
	}

	async update(category: ProductCategoryEntity, dto: ProductCategorySubmitDto): Promise<ProductCategoryEntity> {
		category.name = dto.name;
		category.description = dto.description;
		return await this.dataSource.manager.save(category);
	}

	async setIcon(category: ProductCategoryEntity, url: string): Promise<ProductCategoryEntity> {
		category.icon = url;
		return await this.dataSource.manager.save(category);
	}

	async removeIcon(category: ProductCategoryEntity): Promise<ProductCategoryEntity> {
		category.icon = null;
		return await this.dataSource.manager.save(category);
	}

	async hasProducts(category: ProductCategoryEntity): Promise<boolean> {
		return await this.dataSource.manager.existsBy(ProductEntity, {
			categoryId: category.id
		});
	}

	async delete(category: ProductCategoryEntity): Promise<boolean> {
		const result = await this.dataSource.manager.softDelete(ProductCategoryEntity, category.id);
		return result?.affected > 0;
	}
}