import { IPaginationRequest, IPaginationResponse } from "@common/interfaces";

export class Paginator {
	/**
	 * Return pagination response
	 * @param {IPaginationRequest} IPaginationRequest
	 * @param {Number} totalRecords
	 * @param dtos T[]
	 * @returns Pagination
	 */
	static of<T>(
		{ limit, page, skip }: IPaginationRequest,
		totalRecords: number,
		dtos: T[]
	): IPaginationResponse<T> {
		const totalPages = Math.floor(totalRecords / limit) + (totalRecords % limit > 0 ? 1 : 0);
		const currentPage = +page > 0 ? +page : 1;
		const hasNext = currentPage <= totalPages - 1;

		return {
			totalPages: totalPages,
			payloadSize: dtos.length,
			hasNext: hasNext,
			data: dtos,
			currentPage: currentPage,
			skippedRecords: +skip,
			totalRecords: totalRecords
		};
	}
}
