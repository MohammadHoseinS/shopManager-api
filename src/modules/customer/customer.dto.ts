import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

/**
 * DTO for creating/updating customers
 * - In a real application should be moved to the common library used by the web app and api
 */
export class CustomerSubmitDto {
	@IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	name: string;

	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
	email: string;

	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	note: string;
}

/**
 * DTO for filtering the list of customers
 * - In a real application should be moved to the common library used by the web app and api
 */
export class CustomerFilterDto {
	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	name: string;

	// there is not @IsEmail() constraint on this property, since the user doesn't have to enter the full email to search for the customer with a matching email
	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString({ message: i18nValidationMessage('validation.isString') })
	email: string;
}