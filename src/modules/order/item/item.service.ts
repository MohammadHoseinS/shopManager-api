import { OrderEntity } from "@database/entities/order";
import { OrderItemEntity } from "@database/entities/order-item";
import { ProductEntity } from "@database/entities/product";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { OrderItemAddDto } from "./item.dto";

@Injectable()
export class OrderItemService {
	constructor(private readonly dataSource: DataSource) {}

	/**
	 * Add item to the order
	 */
	async add(order: OrderEntity, product: ProductEntity, dto: OrderItemAddDto): Promise<OrderItemEntity> {
		return await this.dataSource.manager.save(new OrderItemEntity({
			orderId: order.id,
			order: Promise.resolve(order),
			productId: product.id,
			product: Promise.resolve(product),
			quantity: dto.quantity
		}));
	}

	async getExistingOrderItem(order: OrderEntity, product: ProductEntity): Promise<OrderItemEntity> {
		return await this.dataSource.manager.findOneBy(OrderItemEntity, {
			orderId: order.id,
			productId: product.id
		});
	}

	async increaseQuantity(item: OrderItemEntity, amount: number = 1): Promise<OrderItemEntity> {
		item.quantity += amount;
		return await this.dataSource.manager.save(item);
	}

	async decreaseQuantity(item: OrderItemEntity): Promise<OrderItemEntity> {
		item.quantity -= 1;
		return await this.dataSource.manager.save(item);
	}

	async delete(item: OrderItemEntity): Promise<boolean> {
		await this.dataSource.manager.remove(item);
		return true;
	}
}