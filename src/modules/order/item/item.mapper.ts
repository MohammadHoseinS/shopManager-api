import { OrderItemEntity } from "@database/entities/order-item";
import { OrderItem } from "./item.model";
import { OrderStatus } from "@common/enums";

export class OrderItemMapper {
	static async toModel(entity: OrderItemEntity): Promise<OrderItem> {
		const [order, product] = await Promise.all([
			entity.order,
			entity.product
		]);

		// if the order is in draft status, return the current product price
		const unitPrice = order.status === OrderStatus.Draft ? product.price : entity.unitPrice;
		const subtotal = order.status === OrderStatus.Draft ? unitPrice * entity.quantity : entity.subtotal;

		return new OrderItem({
			id: entity.id,
			name: product.name,
			quantity: entity.quantity,
			unitPrice: Number(unitPrice),
			subtotal: Number(subtotal)
		});
	}
}