import { SortDirection } from './misc';

export enum TransactionSortKey {
	EXPENSE_DATE = 'EXPENSE_DATE'
}

export enum TransactionCategoryType {
	WITH_CATEGORY = 'WITH_CATEGORY',
	WITHOUT_CATEGORY = 'WITHOUT_CATEGORY'
}

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
