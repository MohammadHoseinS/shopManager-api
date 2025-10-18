
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import dataSource from '@database/datasource';
import { ProductEntity } from '@database/entities/product';

@Injectable()
export class ProductPipe implements PipeTransform {
	async transform(id: number, _metadata: ArgumentMetadata): Promise<ProductEntity> {
		try {
			return await dataSource.manager.findOneOrFail(ProductEntity, {
				where: { id }
			});
		} catch (error) {
			throw new BadRequestException('product.exceptions.notFound');
		}
	}
}
