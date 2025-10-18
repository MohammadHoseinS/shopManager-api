import { BaseEntity } from "@database/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProductCategoryEntity } from "./product-category";

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
		type: 'decimal',
		precision: 12,
		scale: 2,
		nullable: false,
		default: 0
	})
	price: number;

	@Column({
		nullable: true,
		default: null
	})
	image: string;

	@Column({
		type: 'tinyint',
		nullable: false,
		default: 0
	})
	stock: number;

	/************************* Relations *************************/

	@ManyToOne(() => ProductCategoryEntity, category => category.products)
	category: Promise<ProductCategoryEntity>;

	/************************* Functions *************************/

	constructor(props?: Partial<ProductEntity>) {
		super();
		Object.assign(this, props);
	}
}