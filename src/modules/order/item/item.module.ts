import { Module } from "@nestjs/common";
import { OrderItemController } from "./item.controller";
import { OrderItemService } from "./item.service";

@Module({
	controllers: [OrderItemController],
	providers: [OrderItemService],
})
export class OrderItemModule {}