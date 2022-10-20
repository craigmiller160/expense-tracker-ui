import {
	SearchTransactionsRequest,
	TransactionResponse
} from './generated/expense-tracker';

export type EnhancedSearchTransactionsRequest = Omit<
	SearchTransactionsRequest,
	'startDate' | 'endDate'
> & {
	readonly startDate?: Date;
	readonly endDate?: Date;
};

export interface TransactionDetailsResponse extends TransactionResponse {
	readonly created: string;
	readonly updated: string;
}
