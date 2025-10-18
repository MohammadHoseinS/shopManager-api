import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@database/database.module';
import { StorageModule } from '@shared/storage';
import { ProductCategoryModule } from '@modules/category/category.module';
import { LocalizationModule } from '@shared/localization';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    LocalizationModule,
    ProductCategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
