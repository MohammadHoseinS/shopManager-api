import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { PaginationParams, ResponseMessage } from "@common/decorators";
import { ParamValidationPipe } from "@common/pipes";
import { ProductFilterDto, ProductSubmitDto } from "./product.dto";
import { IPaginationRequest, IPaginationResponse } from "@common/interfaces";
import { Product } from "./product.model";
import { Paginator } from "@common/helpers";
import { ProductMapper } from "./product.mapper";
import { ProductEntity } from "@database/entities/product";
import { ProductPipe } from "./product.pipe";
import { ProductCategoryPipe } from "@modules/category/category.pipe";
import { ProductCategoryEntity } from "@database/entities/product-category";

@Controller('products')
export class ProductController {
	constructor(private readonly product$: ProductService) {}

	@ResponseMessage('product.loaded')
	@Get()
	async load(
		@PaginationParams(new ParamValidationPipe(ProductFilterDto))
		pagination: IPaginationRequest<ProductFilterDto>
	): Promise<IPaginationResponse<Product>> {
		const [products, total] = await this.product$.load(pagination);

		let models: Product[] = [];
		if (products?.length) {
			models = await Promise.all(
				products.map(ProductMapper.toModel)
			);
		}

		return Paginator.of<Product>(pagination, total, models);
	}

	@ResponseMessage('product.retrieved')
	@Get(':id')
	async getById(
		@Param('id', ProductPipe) product: ProductEntity
	): Promise<Product> {
		return await ProductMapper.toModelWithDetails(product);
	}

	@ResponseMessage('product.created')
	@Post(':categoryId')
	async create(
		@Param('categoryId', ProductCategoryPipe) category: ProductCategoryEntity,
		@Body(ValidationPipe) dto: ProductSubmitDto
	): Promise<Product> {
		const product = await this.product$.create(category, dto);
		if (!product) {
			throw new BadRequestException('product.exceptions.create');
		}

		return await ProductMapper.toModelWithDetails(product);
	}

	@ResponseMessage('product.updated')
	@Put(':id')
	async update(
		@Param('id', ProductPipe) product: ProductEntity,
		@Body(ValidationPipe) dto: ProductSubmitDto
	): Promise<Product> {
		const updated = await this.product$.update(product, dto);
		return await ProductMapper.toModelWithDetails(updated);
	}

	@ResponseMessage('product.deleted')
	@Delete(':id')
	async delete(
		@Param('id', ProductPipe) product: ProductEntity
	): Promise<boolean> {
		const result = await this.product$.delete(product);
		if (!result) {
			throw new BadRequestException('product.exceptions.delete');
		}

		return true;
	}
}