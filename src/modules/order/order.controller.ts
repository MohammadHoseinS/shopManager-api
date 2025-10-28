import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { OrderService } from "./order.service";
import { PaginationParams, ResponseMessage } from "@common/decorators";
import { ParamValidationPipe } from "@common/pipes";
import { OrderFilterDto, OrderSubmitDto } from "./order.dto";
import { IPaginationRequest, IPaginationResponse } from "@common/interfaces";
import { Order } from "./order.model";
import { Paginator } from "@common/helpers";
import { OrderMapper } from "./order.mapper";
import { OrderPipe } from "./order.pipe";
import { OrderEntity } from "@database/entities/order";
import { CustomerPipe } from "@modules/customer/customer.pipe";
import { CustomerEntity } from "@database/entities/customer";
import { OrderStatus } from "@common/enums";

@Controller('orders')
export class OrderController {
	constructor(private readonly order$: OrderService) {}

	@ResponseMessage('order.loaded')
	@Get()
	async load(
		@PaginationParams(new ParamValidationPipe(OrderFilterDto))
		pagination: IPaginationRequest<OrderFilterDto>
	): Promise<IPaginationResponse<Order>> {
		const [orders, total] = await this.order$.load(pagination);
		if (!orders?.length) {
			return Paginator.of<Order>(pagination, 0, []);
		}

		const models = await Promise.all(orders.map(OrderMapper.toModel));
		return Paginator.of<Order>(pagination, total, models);
	}

	@ResponseMessage('order.retrieved')
	@Get(':id')
	async getById(
		@Param('id', OrderPipe) order: OrderEntity
	): Promise<Order> {
		return await OrderMapper.toModelWithDetails(order);
	}

	@ResponseMessage('order.created')
	@Post(':customerId')
	async create(
		@Param('customerId', CustomerPipe) customer: CustomerEntity,
		@Body(ValidationPipe) dto: OrderSubmitDto
	): Promise<Order> {
		const order = await this.order$.create(customer, dto);
		if (!order) {
			throw new BadRequestException('order.exceptions.create');
		}

		return await OrderMapper.toModelWithDetails(order);
	}

	@ResponseMessage('order.updated')
	@Put(':id')
	async update(
		@Param('id', OrderPipe) order: OrderEntity,
		@Body(ValidationPipe) dto: OrderSubmitDto
	): Promise<Order> {
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order.exceptions.finalized');
		}
		const result = await this.order$.update(order, dto);
		return await OrderMapper.toModelWithDetails(result);
	}

	@ResponseMessage('order.finalized')
	@Put(':id/finalize')
	async finalize(
		@Param('id', OrderPipe) order: OrderEntity
	): Promise<Order> {
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order.exceptions.finalized');
		}

		const totalItems = await order.getTotalItems();
		if (!totalItems) {
			throw new BadRequestException('order.exceptions.no-items');
		}

		const result = await this.order$.finalize(order);
		return await OrderMapper.toModelWithDetails(result);
	}

	@ResponseMessage('order.shipped')
	@Put(':id/ship')
	async ship(
		@Param('id', OrderPipe) order: OrderEntity
	): Promise<Order> {
		if (order.status !== OrderStatus.Finalized) {
			throw new BadRequestException('order.exceptions.not-finalized');
		}
		const result = await this.order$.ship(order);
		return await OrderMapper.toModelWithDetails(result);
	}

	@ResponseMessage('order.canceled')
	@Put(':id/cancel')
	async cancel(
		@Param('id', OrderPipe) order: OrderEntity
	): Promise<Order> {
		if (order.status !== OrderStatus.Finalized) {
			throw new BadRequestException('order.exceptions.not-finalized');
		}
		const result = await this.order$.cancel(order);
		return await OrderMapper.toModelWithDetails(result);
	}

	@ResponseMessage('order.deleted')
	@Delete(':id')
	async delete(
		@Param('id', OrderPipe) order: OrderEntity
	): Promise<boolean> {
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order.exceptions.finalized');
		}
		return await this.order$.delete(order);
	}
}