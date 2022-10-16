import { SortDirection } from './misc';
import { DbRecord } from './db';

export enum TransactionSortKey {
	EXPENSE_DATE = 'EXPENSE_DATE'
}

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
	readonly isPossibleRefund?: boolean;
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

export interface TransactionDetailsResponse extends TransactionResponse {
	readonly created: string;
	readonly updated: string;
}

export interface TransactionsPageResponse {
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
	readonly possibleRefund: CountAndOldest;
}

export interface TransactionToUpdate {
	readonly transactionId: string;
	readonly categoryId: string | null;
	readonly confirmed: boolean;
}

export interface UpdateTransactionsRequest {
	readonly transactions: ReadonlyArray<TransactionToUpdate>;
}

export type DeleteTransactionsRequest = {
	readonly ids: ReadonlyArray<string>;
};

export type UpdateTransactionDetailsRequest = {
	readonly transactionId: string;
	readonly confirmed: boolean;
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly categoryId?: string;
};

export type CreateTransactionRequest = {
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly categoryId?: string;
};

export type TransactionDuplicateResponse = {
	readonly id: string;
	readonly created: string;
	readonly updated: string;
	readonly categoryName?: string;
};

export type TransactionDuplicatePageResponse = {
	readonly transactions: ReadonlyArray<TransactionDuplicateResponse>;
	readonly pageNumber: number;
	readonly totalItems: number;
};
