import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { PaginationParams, ResponseMessage } from "@common/decorators";
import { ParamValidationPipe } from "@common/pipes";
import { CustomerFilterDto, CustomerSubmitDto } from "./customer.dto";
import { IPaginationRequest, IPaginationResponse } from "@common/interfaces";
import { Customer } from "./customer.model";
import { Paginator } from "@common/helpers";
import { CustomerMapper } from "./customer.mapper";
import { CustomerPipe } from "./customer.pipe";
import { CustomerEntity } from "@database/entities/customer";

@Controller('customers')
export class CustomerController {
	constructor(private readonly customer$: CustomerService) {}

	/**
	 * Load customers with pagination and optional filtering
	 */
	@ResponseMessage('customer.loaded')
	@Get()
	async load(
		@PaginationParams(new ParamValidationPipe(CustomerFilterDto)) 
		pagination: IPaginationRequest<CustomerFilterDto>
	): Promise<IPaginationResponse<Customer>> {
		const [entities, total] = await this.customer$.load(pagination);
		if (!entities?.length) {
			return Paginator.of<Customer>(pagination, total, []);
		}

		const models = await Promise.all(entities.map(CustomerMapper.toModel));
		return Paginator.of<Customer>(pagination, total, models);
	}

	/**
	 * Load customer detailed view by id
	 */
	@ResponseMessage('customer.retrieved')
	@Get(':id')
	async getById(
		@Param('id', CustomerPipe) customer: CustomerEntity
	): Promise<Customer> {
		return CustomerMapper.toModelWithDetails(customer);
	}

	@ResponseMessage('customer.created')
	@Post()
	async create(
		@Body(ValidationPipe) dto: CustomerSubmitDto
	): Promise<Customer> {
		const result = await this.customer$.create(dto);
		if (!result) {
			throw new InternalServerErrorException('customer.exceptions.create');
		}
		return CustomerMapper.toModelWithDetails(result);
	}

	@ResponseMessage('customer.updated')
	@Put(':id')
	async update(
		@Param('id', CustomerPipe) customer: CustomerEntity,
		@Body(ValidationPipe) dto: CustomerSubmitDto
	): Promise<Customer> {
		const result = await this.customer$.update(customer, dto);
		if (!result) {
			throw new InternalServerErrorException('customer.exceptions.update');
		}
		return CustomerMapper.toModelWithDetails(result);
	}

	@ResponseMessage('customer.deleted')
	@Delete(':id')
	async delete(
		@Param('id', CustomerPipe) customer: CustomerEntity
	): Promise<boolean> {
		const hasOrders = await this.customer$.hasOrders(customer);
		if (hasOrders) {
			throw new BadRequestException('customer.exceptions.hasOrders');
		}
		return await this.customer$.delete(customer);
	}
}