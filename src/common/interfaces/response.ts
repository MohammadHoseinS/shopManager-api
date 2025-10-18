/**
 * Global response interface
 */
export interface IResponse<T=any> {

	/**
	 * Response Data
	 */
	data?: T;

	/**
	 * Response message
	 */
	message?: string;

	/**
	 * Response message
	 */
	redirectUrl?: string;

	/**
	 * Success indicator
	 */
	success?: boolean;
}
