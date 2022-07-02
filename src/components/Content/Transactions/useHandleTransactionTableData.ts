import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import {
	TransactionResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { CategoryResponse } from '../../../types/categories';
import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import { useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

export type CategoryOption = SelectOption<string>;

export interface PaginationState {
	readonly pageNumber: number;
	readonly pageSize: number;
}

export interface TransactionFormValues {
	readonly category: CategoryOption;
}

export interface TransactionTableForm {
	readonly transactions: ReadonlyArray<TransactionFormValues>;
}

const createTransactionFormKey = (index: number, field: string): string =>
	`transactions.${index}.${field}`;

export interface TransactionTableData {
	readonly transactions: ReadonlyArray<TransactionResponse>;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly totalRecords: number;
	readonly isFetching: boolean;
	readonly form: UseFormReturn<TransactionTableForm>;
}

const categoryToCategoryOption = (
	category: CategoryResponse
): CategoryOption => ({
	label: category.name,
	value: category.id
});

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
	const form = useForm<TransactionTableForm>();

	const categories = useMemo(
		() => categoryData?.map(categoryToCategoryOption),
		[categoryData]
	);

	return {
		transactions: transactionData?.transactions ?? [],
		categories: categories ?? [],
		totalRecords: transactionData?.totalItems ?? 0,
		isFetching: transactionIsFetching || categoryIsFetching,
		form
	};
};
