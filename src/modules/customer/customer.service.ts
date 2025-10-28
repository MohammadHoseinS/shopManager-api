import { IPaginationRequest } from "@common/interfaces";
import { CustomerEntity } from "@database/entities/customer";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CustomerFilterDto, CustomerSubmitDto } from "./customer.dto";
import { OrderEntity } from "@database/entities/order";
import { OrderStatus } from "@common/enums";

@Injectable()
export class CustomerService {
	constructor(private readonly dataSource: DataSource) {}

	async load(pagination: IPaginationRequest<CustomerFilterDto>): Promise<[CustomerEntity[], number]> {
		const { limit: take, skip, params: { name, email } } = pagination;

		const query = this.dataSource
			.createQueryBuilder(CustomerEntity, 'c')
			.orderBy('c.name', 'DESC')
			.take(take)
			.skip(skip);

		if (name) {
			query.andWhere('c.name ILIKE :name', { name: `%${name}%`})
		}

		if (email) {
			query.andWhere('c.email ILIKE :email', { email: `%${email}%`})
		}

		return await query.getManyAndCount();
	}

	async create(dto: CustomerSubmitDto): Promise<CustomerEntity> {
		return await this.dataSource.manager.save(new CustomerEntity({
			name: dto.name,
			email: dto.email,
			note: dto.note
		}));
	}

	async update(customer: CustomerEntity, dto: CustomerSubmitDto): Promise<CustomerEntity> {
		customer.name = dto.name;
		// set default value of nullable fields to null, since if it's undefined, typeorm it doesn't get updated in postgersql
		customer.email = dto.email ?? null;
		customer.note = dto.note ?? null;
		return await this.dataSource.manager.save(customer);
	}

	async hasOrders(customer: CustomerEntity): Promise<boolean> {
		return await this.dataSource.manager.existsBy(OrderEntity, {
			customerId: customer.id
		});
	}

	async delete(customer: CustomerEntity): Promise<boolean> {
		await this.dataSource.manager.softRemove(customer);
		return true;
	}
}