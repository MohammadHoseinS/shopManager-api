import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validateOrReject } from 'class-validator';

/**
 * Used for validation with custom param decorators
 *
 * Validates the given field of the specified class's instance
 *
 * @field has the default value of 'params', since this pipe is mainly used to validate the params object in the IPaginationRequest interface
 */
@Injectable()
export class ParamValidationPipe implements PipeTransform<any> {
	constructor(
		private readonly cls: ClassConstructor<any>,
		private readonly field = 'params'
	) {}

	async transform(value: any) {
		if (!value.hasOwnProperty(this.field)) {
			return value;
		}

		value[this.field] = plainToInstance(this.cls, value[this.field]);

		await validateOrReject(value[this.field]).catch(errors => {
			throw new BadRequestException({
				message: this.extractValidationMessages(errors),
				error: 'Bad Request',
				statusCode: 400
			});
		});

		return value;
	}

	private extractValidationMessages(errors: ValidationError[]): string[] {
		const validationMessages: Record<string, string[]> = {};
		const errorMessages: string[] = [];
		errors.forEach(error => {
			const property = error.property;
			const constraints = error.constraints;

			if (property && constraints) {
				validationMessages[property] = Object.values(constraints);
			}
			errorMessages.push(Object.values(constraints).join());
		});

		return errorMessages;
	}
}
