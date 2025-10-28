import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import dataSource from '@database/datasource';
import { CustomerEntity } from '@database/entities/customer';

@Injectable()
export class CustomerPipe implements PipeTransform {
	async transform(id: number, _metadata: ArgumentMetadata): Promise<CustomerEntity> {
		try {
			return await dataSource.manager.findOneOrFail(CustomerEntity, {
				where: { id }
			});
		} catch (error) {
			throw new BadRequestException('customer.exceptions.notFound');
		}
	}
}
