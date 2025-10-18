import { BaseEntity } from "@database/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ProductEntity } from "./product";
import dataSource from "@database/datasource";

@Entity('productCategories')
export class ProductCategoryEntity extends BaseEntity {
	@Column()
	name: string;

	@Column({
		nullable: true,
		default: null
	})
	description: string;

	/**
	 * The URL of the category's image
	 */
	@Column({
		nullable: true,
		default: null
	})
	icon: string;

	/************************* Relations *************************/

	@OneToMany(() => ProductEntity, product => product.category)
	products: Promise<ProductEntity[]>;

	/************************* Functions *************************/

	constructor(props?: Partial<ProductCategoryEntity>) {
		super();
		Object.assign(this, props);
	}

	async getTotalItems(): Promise<number> {
		return await dataSource.manager.countBy(ProductEntity, {
			categoryId: this.id
		})
	}
}