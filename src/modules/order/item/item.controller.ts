import { BadRequestException, Body, Controller, Delete, InternalServerErrorException, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { OrderItemService } from "./item.service";
import { OrderPipe } from "../order.pipe";
import { OrderEntity } from "@database/entities/order";
import { ProductEntity } from "@database/entities/product";
import { ProductPipe } from "@modules/product/product.pipe";
import { OrderItem } from "./item.model";
import { OrderItemAddDto } from "./item.dto";
import { OrderItemMapper } from "./item.mapper";
import { OrderItemPipe } from "./item.pipe";
import { OrderItemEntity } from "@database/entities/order-item";
import { OrderStatus } from "@common/enums";
import { ResponseMessage } from "@common/decorators";

@Controller('order/items')
export class OrderItemController {
	constructor(private readonly item$: OrderItemService) {}

	@ResponseMessage('order-item.created')
	@Post(':orderId/:productId')
	async addItem(
		@Param('orderId', OrderPipe) order: OrderEntity,
		@Param('productId', ProductPipe) product: ProductEntity,
		@Body(ValidationPipe) dto: OrderItemAddDto
	): Promise<OrderItem> {
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order-item.exceptions.finalized');
		}

		const existingItem = await this.item$.getExistingOrderItem(order, product);
		if (existingItem) {
			const result = await this.item$.increaseQuantity(existingItem, dto.quantity);
			if (!result) {
				throw new InternalServerErrorException('order-item.exceptions.quantity-increase');
			}
			return await OrderItemMapper.toModel(result);
		}

		const result = await this.item$.add(order, product, dto);
		if (!result) {
			throw new InternalServerErrorException('order-item.exceptions.create');
		}

		return await OrderItemMapper.toModel(result);
	}

	@ResponseMessage('order-item.quantity-increased')
	@Put(':id/increase')
	async increaseQuantity(
		@Param('id', OrderItemPipe) item: OrderItemEntity
	): Promise<OrderItem> {
		const order = await item.order;
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order-item.exceptions.finalized');
		}

		const result = await this.item$.increaseQuantity(item);
		if (!result) {
			throw new InternalServerErrorException('order-item.exceptions.quantity-increase');
		}

		return await OrderItemMapper.toModel(result);
	}

	@ResponseMessage('order-item.quantity-decreased')
	@Put(':id/decrease')
	async decreaseQuantity(
		@Param('id', OrderItemPipe) item: OrderItemEntity
	): Promise<OrderItem> {
		const order = await item.order;
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order-item.exceptions.finalized');
		}

		if (item.quantity === 1) {
			throw new BadRequestException('order-item.exceptions.min-quantity');
		}

		const result = await this.item$.decreaseQuantity(item);
		if (!result) {
			throw new InternalServerErrorException('order-item.exceptions.quantity-decrease');
		}

		return await OrderItemMapper.toModel(result);
	}

	@ResponseMessage('order-item.deleted')
	@Delete(':id')
	async deleteItem(
		@Param('id', OrderItemPipe) item: OrderItemEntity
	): Promise<boolean> {
		const order = await item.order;
		if (order.status !== OrderStatus.Draft) {
			throw new BadRequestException('order-item.exceptions.finalized');
		}

		const result = await this.item$.delete(item);
		if (!result) {
			throw new InternalServerErrorException('order-item.exceptions.delete');
		}

		return true;
	}
}