import { CustomerEntity } from "@database/entities/customer";
import { Customer } from "./customer.model";

export class CustomerMapper {
	static toModel(entity: CustomerEntity): Customer {
		return new Customer({
			id: entity.id,
			name: entity.name,
			email: entity.email || ''
		})
	}

	static toModelWithDetails(entity: CustomerEntity): Customer {
		return new Customer({
			id: entity.id,
			name: entity.name,
			email: entity.email || '',
			note: entity.note || ''
		})
	}
}