import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import {
	TransactionResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { CategoryResponse } from '../../../types/categories';

export interface PaginationState {
	readonly pageNumber: number;
	readonly pageSize: number;
}

export interface TransactionTableData {
	readonly transactions: ReadonlyArray<TransactionResponse>;
	readonly categories: ReadonlyArray<CategoryResponse>;
	readonly totalRecords: number;
	readonly isFetching: boolean;
}

export const useHandleTransactionTableData = (
	pagination: PaginationState
): TransactionTableData => {
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const { data: transactionData, isFetching: transactionIsFetching } =
		useSearchForTransactions({
			...pagination,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});

	return {
		transactions: transactionData?.transactions ?? [],
		categories: categoryData ?? [],
		totalRecords: transactionData?.totalItems ?? 0,
		isFetching: transactionIsFetching || categoryIsFetching
	};
};
