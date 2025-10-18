import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@database/database.module';
import { StorageModule } from '@shared/storage';
import { LocalizationModule } from '@shared/localization';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    LocalizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
