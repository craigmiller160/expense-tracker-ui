import { SearchTransactionsRequest } from './generated/expense-tracker';

export type EnhancedSearchTransactionsRequest = Omit<
	SearchTransactionsRequest,
	'startDate' | 'endDate'
> & {
	readonly startDate?: Date;
	readonly endDate?: Date;
};
