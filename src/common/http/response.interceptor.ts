import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseMessageKey } from '@common/decorators';
import { IResponse } from '@common/interfaces';

/**
 * Global response interface
 */
@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
	constructor(private reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
		return next.handle().pipe(
			map(payload => {
				const ctx = context.switchToHttp();
				const hdl = context.getHandler();
				const request = ctx.getRequest();
				const i18n = I18nContext.current();

				const response: IResponse = {};

				const msg = this.reflector.get<string>(ResponseMessageKey, hdl) ?? payload?.message;

				if (msg) {
					response.message = i18n.t(msg, { args: request.body });
				}

				if (payload?.success !== undefined) {
					response.success = payload.success;
				}

				if (payload !== null && payload !== undefined) {
					// if (typeof payload === 'object' && payload?.currentPage !== undefined) {
					//     // detected paginated payload
					//     response.data = {
					//         items: payload.data ?? [],
					//         currentPage: payload.currentPage,
					//         totalPages: payload.totalPages,
					//         totalItems: payload.totalItems,
					//         perPage: payload.perPage,
					//     };
					// } else {
					response.data = payload;
					// }
				}

				return response;
			})
		);
	}
}
