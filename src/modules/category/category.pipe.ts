import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import dataSource from '@database/datasource';
import { ProductCategoryEntity } from '@database/entities/product-category';

@Injectable()
export class ProductCategoryPipe implements PipeTransform {
	async transform(id: number, _metadata: ArgumentMetadata): Promise<ProductCategoryEntity> {
		try {
			return await dataSource.manager.findOneOrFail(ProductCategoryEntity, {
				where: { id }
			});
		} catch (error) {
			throw new BadRequestException('category.exceptions.notFound');
		}
	}
}
