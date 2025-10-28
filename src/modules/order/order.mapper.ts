import { OrderEntity } from "@database/entities/order";
import { Order } from "./order.model";
import { CustomerMapper } from "@modules/customer/customer.mapper";
import { OrderItemMapper } from "./item/item.mapper";

export class OrderMapper {
	static async toModel(entity: OrderEntity): Promise<Order> {
		const [customer, totalPrice] = await Promise.all([
			entity.customer,
			entity.getTotalPrice()
		]);
		const customerModel = CustomerMapper.toModel(customer);

		return new Order({
			id: entity.id,
			customer: customerModel,
			totalPrice: Number(totalPrice),
			description: entity.description || '',
			createdOn: entity.createdOn,
			finalizedOn: entity.finalizedOn,
			shippedOn: entity.shippedOn,
			canceledOn: entity.canceledOn,
			status: entity.status
		});
	}

	static async toModelWithDetails(entity: OrderEntity): Promise<Order> {
		const [model, items] = await Promise.all([
			this.toModel(entity),
			entity.items
		]);

		const itemModels = items?.length ? await Promise.all(items.map(OrderItemMapper.toModel)) : [];
		model.items = itemModels;

		return model;
	}
}