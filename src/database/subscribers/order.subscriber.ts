import { OrderStatus } from "@common/enums";
import dataSource from "@database/datasource";
import { OrderEntity } from "@database/entities/order";
import { OrderItemEntity } from "@database/entities/order-item";
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<OrderEntity> {
	listenTo() {
		return OrderEntity;
	}

	async beforeUpdate(event: UpdateEvent<OrderEntity>): Promise<void> {
		const { entity: updatedOrder, databaseEntity: previousOrder } = event;

		// if the order status changed from draft to finalized
		// calculate and save the order items prices and subtotal
		// calculate and save the order's total price
		if (previousOrder.status === OrderStatus.Draft && updatedOrder.status === OrderStatus.Finalized) {
			const items = await dataSource.manager.findBy(OrderItemEntity, {
				orderId: previousOrder.id
			});
			let totalPrice = 0;
			for (const item of items) {
				const product = await item.product;
				item.unitPrice = product.price;
				item.subtotal = item.unitPrice * item.quantity;
				totalPrice += item.subtotal;
				await dataSource.manager.save(item);
			}
			updatedOrder.totalPrice = totalPrice;
		} 
	}
}