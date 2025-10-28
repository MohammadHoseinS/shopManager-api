import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });
export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DATABASE_HOSTNAME,
	port: parseInt(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: process.env.PRODUCTION === 'true' ? false : true,
	migrations: ['dist/database/migrations/**/*.ts'],
	entities: ['dist/database/entities/**/*.js'],
	subscribers: ['dist/database/subscribers/**/*.subscriber.js']
}
const dataSource = new DataSource(dataSourceOptions);
const initializeWithRetry = async (retries = 3) => {
	for (let i = 0; i < retries; i++) {
		try {
			await dataSource.initialize();
			console.log('Database connection established successfully');
			return;
		} catch (error) {
			console.error(`Database connection attempt ${i + 1} failed:`, error.message);
			if (i === retries - 1) {
				console.error('Error during Data Source initialization:');
				console.error('Database config:', {
					host: process.env.DATABASE_HOSTNAME,
					port: process.env.DATABASE_PORT,
					username: process.env.DATABASE_USERNAME,
					database: process.env.DATABASE_NAME
				});
				console.error('Full error:', error);
				throw new Error(
					`Database connection failed after ${retries} attempts: ${error.message}`
				);
			}
			// Wait before retrying
			await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
		}
	}
};
initializeWithRetry().catch(error => {
	console.error('Fatal database error:', error);
	process.exit(1);
});
export default dataSource;