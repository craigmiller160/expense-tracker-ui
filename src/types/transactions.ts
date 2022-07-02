import { SortDirection } from './misc';
import { DbRecord } from './db';

export enum TransactionSortKey {
	EXPENSE_DATE = 'EXPENSE_DATE'
}

export enum TransactionCategoryType {
	WITH_CATEGORY = 'WITH_CATEGORY',
	WITHOUT_CATEGORY = 'WITHOUT_CATEGORY'
}

export const DATE_FORMAT = 'yyyy-MM-dd';

export interface SearchTransactionsRequest {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly sortKey: TransactionSortKey;
	readonly sortDirection: SortDirection;
	readonly startDate?: Date;
	readonly endDate?: Date;
	readonly confirmed?: boolean;
	readonly categoryType?: TransactionCategoryType;
	readonly categoryIds?: ReadonlyArray<string>;
}

export interface TransactionResponse extends DbRecord {
	readonly expenseDate: string; // TODO can I get this transformed to being a Date?
	readonly description: string;
	readonly amount: number;
	readonly confirmed: boolean;
	readonly categoryId?: string;
	readonly categoryName?: string;
}

export interface SearchTransactionsResponse {
	readonly pageNumber: number;
	readonly totalItems: number;
	readonly transactions: ReadonlyArray<TransactionResponse>;
}
