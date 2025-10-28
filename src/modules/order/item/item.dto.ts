import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class OrderItemAddDto {
	@IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
	@IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
	@Min(1, { message: i18nValidationMessage('validation.min') })
	quantity: number;
}