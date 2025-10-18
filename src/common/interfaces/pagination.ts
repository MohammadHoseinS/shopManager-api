/**
 * Interface intended for requesting results paginated
 */
export interface IPaginationRequest<T = any> {
	/**
	 * Number of records to skip (where the pagination shall start)
	 * calculated value from current page and limit,
	 * do not send this variable in the request
	 */
	skip?: number;

	/**
	 * The index of the page where the pagination should start from.
	 *
	 * Its intended for the same purpose that `skip`, but the latter represents an amount of
	 * records that should be skipped.
	 *
	 * Should be used only when needed to handle the pagination by the current page index.
	 */
	page?: number;

	/**
	 * Page size (calculate result length)
	 */
	limit?: number;

	/**
	 * Sort field name
	 */
	orderBy?: string;

	/**
	 * Sort direction
	 */
	orderDirection?: 'ASC' | 'DESC';

	/**
	 * Other params of type T
	 */
	params?: T;
}

/**
 * Pagination response
 */
export interface IPaginationResponse<T> {

	/**
	 * Current page
	 */
	currentPage: number;

	/**
	 * Skipped records
	 */
	skippedRecords?: number;

	/**
	 * Total records related to IPaginationRequest
	 */
	totalPages: number;

	/**
	 * Has more indicator
	 */
	hasNext: boolean;

	/**
	 * Response data
	 */
	data: T[];

	/**
	 * Current payload length
	 */
	payloadSize?: number;

	/**
	 * Total records without paging
	 */
	totalRecords?: number;
}
