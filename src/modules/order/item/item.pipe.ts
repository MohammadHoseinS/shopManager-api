
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import dataSource from '@database/datasource';
import { OrderItemEntity } from '@database/entities/order-item';

@Injectable()
export class OrderItemPipe implements PipeTransform {
	async transform(id: number, _metadata: ArgumentMetadata): Promise<OrderItemEntity> {
		try {
			return await dataSource.manager.findOneOrFail(OrderItemEntity, {
				where: { id }
			});
		} catch (error) {
			throw new BadRequestException('order-item.exceptions.notFound');
		}
	}
}
