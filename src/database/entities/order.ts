import { BaseEntity } from "@database/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CustomerEntity } from "./customer";
import { OrderItemEntity } from "./order-item";
import { OrderStatus } from "@common/enums";

@Entity('orders')
export class OrderEntity extends BaseEntity {
	@Column({
		nullable: false
	})
	customerId: number;

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		nullable: false,
		default: 0
	})
	totalPrice: number;

	@Column({
		nullable: true,
		default: null
	})
	description: string;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		nullable: false,
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
}