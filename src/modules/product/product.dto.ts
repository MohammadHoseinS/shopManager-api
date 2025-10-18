import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class ProductFilterDto {
	@IsOptional()
	@Transform(({ value }) =>
		value ?
			Array.isArray(value) ?
				value.map(v => +v)
			:	[+value]
		:	undefined
	)
	@IsNumber({}, { each: true, message: i18nValidationMessage('validation.isNumber') })
	@Min(1, { each: true, message: i18nValidationMessage('validation.min') })
	categories: number[];

	@IsOptional()
	@IsString({ message: i18nValidationMessage('validation.isString') })
	name: string;
}

export class ProductSubmitDto {
	@IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	name: string;

	@IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
	@IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
	@Min(0.01, { message: i18nValidationMessage('validation.min') })
	price: number;

	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	description?: string;

	@IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
	@IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
	@Min(0, { message: i18nValidationMessage('validation.min') })
	stock: number;
}