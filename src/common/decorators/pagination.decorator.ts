import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator intended for building a PaginationParams object based on the query string parameters
 */
export const PaginationParams = createParamDecorator(
	(
		data = {
			defaultPage: 1,
			defaultLimit: 10,
			defaultOrder: undefined,
			defaultOrderDirection: 'ASC',
			maxAllowedSize: 0
		},
		ctx: ExecutionContext
	) => {
		const request = ctx.switchToHttp().getRequest();
		let {
			query: { skip, page, limit, ...params }
		} = request;
		const {
			query: { orderBy, orderDirection }
		} = request;
		const { defaultPage, defaultLimit, defaultOrder, defaultOrderDirection, maxAllowedSize } =
			data;
		const order =
			orderBy ?
				{
					[orderBy]: orderDirection ? orderDirection : defaultOrderDirection
				}
			:	defaultOrder;

		limit = limit && limit > 0 ? +limit : defaultLimit;

		if (page) {
			page = +page;
			skip = (+page - 1) * +limit;
			skip = skip >= 0 ? skip : 0;
		} else {
			page = defaultPage;
			skip = 0;
		}

		if (maxAllowedSize > 0) {
			limit = +limit < +maxAllowedSize ? limit : maxAllowedSize;
		}

		params = params || {};

		return Object.assign(data ? data : {}, {
			skip,
			page,
			limit,
			order,
			params
		});
	}
);
