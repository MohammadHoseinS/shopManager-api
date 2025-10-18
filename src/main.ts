import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nMiddleware, I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { Logger } from '@nestjs/common/services/logger.service';
import { HttpExceptionFilter, HttpResponseInterceptor } from '@common/http';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

  	// use i18n middleware
	app.use(I18nMiddleware);

  	// set global filters
	Logger.log(`Implement global custom http filters`);
	app.useGlobalFilters(
		new HttpExceptionFilter(),
		new I18nValidationExceptionFilter(), // optional — formats validation error payload
	);

 	// add global response interceptor
	Logger.log(`Implement http response interceptor`);
	app.useGlobalInterceptors(new HttpResponseInterceptor(new Reflector()));

	// global validation + i18n translation support for validator messages
	Logger.log(`global validation pipes + i18n translation support for validator messages`);
	app.useGlobalPipes(new I18nValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: false,
		validationError: { target: false, value: false },
	}));

	const PORT = process.env.PORT || 3000;
	await app.listen(PORT);

	return PORT;
}
bootstrap();
