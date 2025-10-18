import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

/**
 * HTTP Exception filter
 * On faild request, parse response message and status
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	/**
	 * Catch exception and parse response
	 * @param exception
	 * @param host
	 */
	catch(exception: HttpException, host: ArgumentsHost) {
		const i18n = I18nContext.current();
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest();

		// response payload
		let payload = exception.getResponse() as any;
		let message: string;

		if (i18n && payload) {
			if (typeof payload === 'string') {
				message = i18n.t(payload, { args: request.body || {} });
				payload = { message };
			} else if (Array.isArray(payload.message)) {
				const messages = payload.message as string[];
				/* eslint-disable @typescript-eslint/no-base-to-string */
				payload.message = messages
					.map((msg: string) => i18n.t(msg, { args: request.body || {} }))
					.join('\n');
			} else if (typeof payload.message === 'string') {
				payload.message = i18n.t(payload.message, { args: request.body || {} });
			}
		}

		response.status(+exception.getStatus()).json(payload || {});
	}
}
