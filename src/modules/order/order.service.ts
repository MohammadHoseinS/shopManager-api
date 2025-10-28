import { IPaginationRequest } from "@common/interfaces";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { OrderFilterDto, OrderSubmitDto } from "./order.dto";
import { OrderEntity } from "@database/entities/order";
import { CustomerEntity } from "@database/entities/customer";
import { OrderStatus } from "@common/enums";

@Injectable()
export class OrderService {
	constructor(private readonly dataSource: DataSource) {}

	async load(pagination: IPaginationRequest<OrderFilterDto>): Promise<[OrderEntity[], number]> {
		const { limit: take, skip, params: { customers, fromDate, toDate } } = pagination;

		const query = this.dataSource
			.createQueryBuilder(OrderEntity, 'o')
			.orderBy('o.createdOn', 'DESC')
			.take(take)
			.skip(skip);

		if (customers?.length) {
			query.andWhere('o.customerId IN (:...customers)', { customers });
		}

		if (fromDate) {
			query.andWhere('o.createdOn >= :fromDate', { fromDate });
		}

		if (toDate) {
			query.andWhere('o.createdOn <= :toDate', { toDate });
		}

		return await query.getManyAndCount();
	}

	async create(customer: CustomerEntity, dto: OrderSubmitDto): Promise<OrderEntity> {
		return this.dataSource.manager.save(new OrderEntity({
			customerId: customer.id,
			customer: Promise.resolve(customer),
			description: dto.description
		}));
	}

	async update(order: OrderEntity, dto: OrderSubmitDto): Promise<OrderEntity> {
		// set default value to null, since if it's undefined, typeorm it doesn't get updated in postgersql
		order.description = dto.description ?? null;
		return await this.dataSource.manager.save(order);
	}

	async finalize(order: OrderEntity): Promise<OrderEntity> {
		order.status = OrderStatus.Finalized;
		order.finalizedOn = new Date();
		return await this.dataSource.manager.save(order);
	}

	async ship(order: OrderEntity): Promise<OrderEntity> {
		order.status = OrderStatus.Shipped;
		order.shippedOn = new Date();
		return await this.dataSource.manager.save(order);
	}

	async cancel(order: OrderEntity): Promise<OrderEntity> {
		order.status = OrderStatus.Canceled;
		order.canceledOn = new Date();
		return await this.dataSource.manager.save(order);
	}

	async delete(order: OrderEntity): Promise<boolean> {
		await this.dataSource.manager.softRemove(order);
		return true;
	}
}