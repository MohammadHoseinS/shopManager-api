
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import dataSource from '@database/datasource';
import { OrderEntity } from '@database/entities/order';

@Injectable()
export class OrderPipe implements PipeTransform {
	async transform(id: number, _metadata: ArgumentMetadata): Promise<OrderEntity> {
		try {
			return await dataSource.manager.findOneOrFail(OrderEntity, {
				where: { id }
			});
		} catch (error) {
			throw new BadRequestException('order.exceptions.notFound');
		}
	}
}
