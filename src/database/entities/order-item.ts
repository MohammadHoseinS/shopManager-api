import { Column, Entity, ManyToOne } from "typeorm";
import { ProductEntity } from "./product";
import { OrderEntity } from "./order";
import { BaseEntity } from "@database/base.entity";

@Entity('orderItems')
export class OrderItemEntity extends BaseEntity {
	@Column({
		nullable: false
	})
	orderId: number;

	@Column({
		nullable: false
	})
	productId: number;
	
	@Column({
		type: 'int2',
		nullable: false,
		default: 1
	})
	quantity: number;

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		nullable: false,
		default: 0
	})
	unitPrice: number;

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		nullable: false,
		default: 0
	})
	subtotal: number;

	/************************* Relations *************************/

	@ManyToOne(() => ProductEntity, product => product.orderItems)
	product: Promise<ProductEntity>;

	@ManyToOne(() => OrderEntity, order => order.items)
	order: Promise<OrderEntity>;

	/************************* Methods *************************/

	constructor(props?: Partial<OrderItemEntity>) {
		super();
		Object.assign(this, props);
	}
}