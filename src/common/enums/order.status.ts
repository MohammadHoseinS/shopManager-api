// In a production application this should be moved to a common library (usabale by the front ent as well)
export enum OrderStatus {
	Draft = 'draft',
	Finalized = 'finalized',
	Shipped = 'shipped',
	Canceled = 'canceled'
}