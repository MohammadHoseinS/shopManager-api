import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class OrderSubmitDto {
	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	description?: string;
}

export class OrderFilterDto {
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
	customers: number[];

	@IsOptional()
	@IsDate({ message: i18nValidationMessage('validation.isDate') })
	@Transform(({ value }) => value ? new Date(value) : undefined)
	fromDate: Date;

	@IsOptional()
	@IsDate({ message: i18nValidationMessage('validation.isDate') })
	@Transform(({ value }) => value ? new Date(value) : undefined)
	toDate: Date;
}