import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@database/database.module';
import { StorageModule } from '@shared/storage';
import { ProductCategoryModule } from '@modules/category/category.module';
import { ProductModule } from '@modules/product/product.module';
import { LocalizationModule } from '@shared/localization';
import { CustomerModule } from '@modules/customer/customer.module';
import { OrderModule } from '@modules/order/order.module';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    LocalizationModule,
    ProductCategoryModule,
    ProductModule,
    CustomerModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
