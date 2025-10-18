import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './datasource';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				const synchronize = process.env.PRODUCTION === 'true' ? false : true;
				return {
					...dataSourceOptions,
					autoLoadEntities: true,
					extra: {
						connectionLimit: 10,
						idleTimeout: 300000
					},
					cli: {
						migrationsDir: 'src/database/migrations'
					}
				};
			},
			dataSourceFactory: async options => {
				return await new DataSource(options).initialize();
			}
		})
	]
})
export class DatabaseModule {}
