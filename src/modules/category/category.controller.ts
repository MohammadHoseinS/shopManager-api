import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ProductCategoryService } from "./category.service";
import { PaginationParams, ResponseMessage } from "@common/decorators";
import { ParamValidationPipe } from "@common/pipes";
import { ProductCategoryFilterDto, ProductCategorySubmitDto } from "./category.dto";
import { IPaginationRequest, IPaginationResponse } from "@common/interfaces";
import { ProductCategory } from "./category.model";
import { ProductCategoryMapper } from "./category.mapper";
import { Paginator } from "@common/helpers";
import { ProductCategoryEntity } from "@database/entities/product-category";
import { ProductCategoryPipe } from "./category.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { AwsService } from "@shared/storage";
import { DeleteFileNotExistException, FileUploadFailedException } from "@common/exceptions";

@Controller('categories')
export class ProductCategoryController {
	constructor(
		private readonly category$: ProductCategoryService,
		private readonly aws$: AwsService
	) {}

	@ResponseMessage('category.loaded')
	@Get()
	async load(
		@PaginationParams(new ParamValidationPipe(ProductCategoryFilterDto))
		pagination: IPaginationRequest<ProductCategoryFilterDto>
	): Promise<IPaginationResponse<ProductCategory>> {
		const [categories, total] = await this.category$.load(pagination);

		let models: ProductCategory[] = [];
		if (categories?.length) {
			models = await Promise.all(
				categories.map(ProductCategoryMapper.toModel)
			);
		}

		return Paginator.of<ProductCategory>(pagination, total, models);
	}

	@ResponseMessage('category.created')
	@Post()
	async create(
		@Body(ValidationPipe) dto: ProductCategorySubmitDto
	): Promise<ProductCategory> {
		let category = await this.category$.create(dto);
		if (!category) {
			throw new BadRequestException('category.exceptions.create');
		}

		return await ProductCategoryMapper.toModel(category);
	}

	@ResponseMessage('category.fileUploaded')
	@Post(':id/icon')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@Param('id', ProductCategoryPipe) category: ProductCategoryEntity,
		@UploadedFile() file: Express.Multer.File
	): Promise<ProductCategory> {
		if (!file?.originalname) {
			throw new BadRequestException('file.exceptions.uploadFailed');
		}

		const target = `productCategories/${category.id}`;

		const url = await this.aws$.uploadFile(file, target);
		if (!url) {
			throw new FileUploadFailedException();
		}

		category = await this.category$.setIcon(category, url);
		return await ProductCategoryMapper.toModel(category);
	}

	@ResponseMessage('category.updated')
	@Put(':id')
	async update(
		@Param('id', ProductCategoryPipe) category: ProductCategoryEntity,
		@Body(ValidationPipe) dto: ProductCategorySubmitDto,
	): Promise<ProductCategory> {
		const entity = await this.category$.update(category, dto);
		return await ProductCategoryMapper.toModel(entity);
	}

	@ResponseMessage('category.deleted')
	@Delete(':id')
	async delete(
		@Param('id', ProductCategoryPipe) category: ProductCategoryEntity
	): Promise<boolean> {
		const hasProducts = await this.category$.hasProducts(category);
		if (hasProducts) {
			throw new BadRequestException('category.exceptions.hasProducts');
		}

		const result = await this.category$.delete(category);
		if (!result) {
			throw new BadRequestException('category.exceptions.delete');
		}

		return true;
	}

	@ResponseMessage('category.fileDeleted')
	@Delete(':id/icon')
	async removeIcon(
		@Param('id', ProductCategoryPipe) category: ProductCategoryEntity
	): Promise<ProductCategory> {
		if (!category.icon) {
			return await ProductCategoryMapper.toModel(category);
		}

		// remove image from aws
		const key = this.aws$.extractKeyFromUrl(category.icon);
		const fileExists = await this.aws$.fileExists(key);

		if (!fileExists) {
			throw new DeleteFileNotExistException();
		}

		// delete file from s3
		await this.aws$.delete(key);

		category = await this.category$.removeIcon(category);
		return await ProductCategoryMapper.toModel(category);
	}
}