import { SortDirection } from './misc';
import { DbRecord } from './db';

export enum TransactionSortKey {
	EXPENSE_DATE = 'EXPENSE_DATE'
}

export const DATE_FORMAT = 'yyyy-MM-dd';

export interface SearchTransactionsRequest {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly sortKey: TransactionSortKey;
	readonly sortDirection: SortDirection;
	readonly startDate?: Date;
	readonly endDate?: Date;
	readonly isConfirmed?: boolean;
	readonly isCategorized?: boolean;
	readonly isDuplicate?: boolean;
	readonly categoryIds?: ReadonlyArray<string>;
}

export interface TransactionResponse extends DbRecord {
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly confirmed: boolean;
	readonly duplicate: boolean;
	readonly categoryId?: string;
	readonly categoryName?: string;
}

export interface SearchTransactionsResponse {
	readonly pageNumber: number;
	readonly totalItems: number;
	readonly transactions: ReadonlyArray<TransactionResponse>;
}

export interface TransactionAndCategory {
	readonly transactionId: string;
	readonly categoryId: string | null;
}

export interface CategorizeTransactionsRequest {
	readonly transactionsAndCategories: ReadonlyArray<TransactionAndCategory>;
}

export interface CountAndOldest {
	readonly count: number;
	readonly oldest: string | null;
}

export interface NeedsAttentionResponse {
	readonly unconfirmed: CountAndOldest;
	readonly uncategorized: CountAndOldest;
	readonly duplicate: CountAndOldest;
}

export interface TransactionToUpdate {
	readonly transactionId: string;
	readonly categoryId: string | null;
	readonly confirmed: boolean;
}

export interface UpdateTransactionsRequest {
	readonly transactions: ReadonlyArray<TransactionToUpdate>;
}
