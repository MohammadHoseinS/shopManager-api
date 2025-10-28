import { BaseEntity } from "@database/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CustomerEntity } from "./customer";
import { OrderItemEntity } from "./order-item";
import { OrderStatus } from "@common/enums";
import dataSource from "@database/datasource";

@Entity('orders')
export class OrderEntity extends BaseEntity {
	@Column()
	customerId: number;

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		default: 0
	})
	totalPrice: number;

	@Column({
		nullable: true,
		default: null
	})
	description: string;

	/**
	 * The allowed flow of order status is:
	 * - Draft -> Finalized
	 * - Finalized -> Shipped
	 * - Finalized -> Canceled
	 */
	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.Draft
	})
	status: OrderStatus;

	@Column({
		nullable: true,
		default: null
	})
	finalizedOn: Date;

	@Column({
		nullable: true,
		default: null
	})
	canceledOn: Date;

	/************************* Relations *************************/

	@ManyToOne(() => CustomerEntity, customer => customer.orders)
	customer: Promise<CustomerEntity>;

	@OneToMany(() => OrderItemEntity, item => item.order)
	items: Promise<OrderItemEntity[]>;

	/************************* Methods *************************/

	constructor(props?: Partial<OrderEntity>) {
		super();
		Object.assign(this, props);
	}

	async getTotalItems(): Promise<number> {
		return await dataSource.manager.countBy(OrderItemEntity, {
			orderId: this.id
		})
	}

	async getTotalPrice(): Promise<number> {
		const items = await this.items;
		if (!items?.length) {
			return 0;
		}

		if (this.status === OrderStatus.Draft) {
			const prices = await Promise.all(
				items.map(async item => {
					const product = await item.product;
					return product.price * item.quantity;
				})
			);
			return prices.reduce((sum, price) => sum + price, 0);
		}

		return await dataSource.manager.sum(OrderItemEntity, 'subtotal', {
			orderId: this.id
		});
	}
}