import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

/**
 * DTO for creating/updating product categories
 * - In a real application should be moved to the common library used by the web app and api
 */
export class ProductCategorySubmitDto {
	@IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	name: string;

	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	description?: string;
}

/**
 * DTO for filtering product categories
 * - In a real application should be moved to the common library used by the web app and api
 */
export class ProductCategoryFilterDto {
	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	name?: string;
}