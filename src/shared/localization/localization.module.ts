import { Module, Global } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Global()
@Module({
	imports: [
		I18nModule.forRootAsync({
			useFactory: () => ({
				loaderOptions: {
					path: path.join(__dirname, '../../assets/i18n/'),
					includeSubfolders: true,
					watch: true
				},
				validatorOptions: {
					skipUndefinedProperties: true,
					skipNullProperties: true,
					skipMissingProperties: true
				},
				fallbackLanguage: 'en',
				viewEngine: 'hbs',
				throwOnMissingKey: false,
				disableMiddleware: false,
				fallbacks: {
					'en-*': 'en'
				}
			})
		})
	]
})
export class LocalizationModule {}
