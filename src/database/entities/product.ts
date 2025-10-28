import { BaseEntity } from "@database/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProductCategoryEntity } from "./product-category";
import { OrderItemEntity } from "./order-item";

@Entity('products')
export class ProductEntity extends BaseEntity {
	@Column({
		nullable: true,
		default: null
	})
	categoryId: number;

	@Column()
	name: string;

	@Column({
		nullable: true,
		default: null
	})
	description: string;

	@Column({
		type: 'numeric',
		precision: 12,
		scale: 2,
		nullable: false,
		default: 0
	})
	price: number;

	@Column({
		type: 'int2',
		nullable: false,
		default: 0
	})
	stock: number;

	/************************* Relations *************************/

	@ManyToOne(() => ProductCategoryEntity, category => category.products)
	category: Promise<ProductCategoryEntity>;

	@OneToMany(() => OrderItemEntity, item => item.product)
	orderItems: Promise<OrderItemEntity[]>;

	/************************* Functions *************************/

	constructor(props?: Partial<ProductEntity>) {
		super();
		Object.assign(this, props);
	}
}