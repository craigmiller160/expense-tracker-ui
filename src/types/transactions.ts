import { SearchTransactionsRequest } from './generated/expense-tracker';

export type EnhancedSearchTransactionsRequest = Omit<
	SearchTransactionsRequest,
	'startDate' | 'endDate'
> & {
	readonly startDate: Date | null;
	readonly endDate: Date | null;
};
