import { BaseEntity } from "@database/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { OrderEntity } from "./order";

@Entity('customers')
export class CustomerEntity extends BaseEntity {
	@Column()
	name: string;

	@Column({
		nullable: true,
		default: null
	})
	email: string;

	@Column({
		nullable: true,
		default: null
	})
	note: string;

	/************************* Relations *************************/

	@OneToMany(() => OrderEntity, order => order.customer)
	orders: Promise<OrderEntity[]>;

	/************************* Methods *************************/

	constructor(props?: Partial<CustomerEntity>) {
		super();
		Object.assign(this, props);
	}
}