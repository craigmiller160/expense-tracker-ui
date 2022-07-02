import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import {
	TransactionResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { CategoryResponse } from '../../../types/categories';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { CategoryOption, PaginationState } from './utils';

export interface TransactionFormValues {
	// TODO do I want partial or undefined?
	readonly category: Partial<CategoryOption>;
}

export interface TransactionTableForm {
	readonly transactions: ReadonlyArray<TransactionFormValues>;
}

export interface TransactionTableData {
	readonly transactions: ReadonlyArray<TransactionResponse>;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly currentPage: number;
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

const transactionToCategoryOption = (
	transaction: TransactionResponse
): Partial<CategoryOption> => ({
	label: transaction.categoryId,
	value: transaction.categoryName
});

const transactionToFormValues = (
	transaction: TransactionResponse
): TransactionFormValues => ({
	category: transactionToCategoryOption(transaction)
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

	useEffect(() => {
		if (transactionData) {
			const formValues = transactionData.transactions.map(
				transactionToFormValues
			);
			form.reset({
				transactions: formValues
			});
		}
	}, [transactionData]);

	useEffect(() => {
		if (transactionIsFetching) {
			form.reset({
				transactions: []
			});
		}
	}, [transactionIsFetching]);

	return {
		transactions: transactionData?.transactions ?? [],
		categories: categories ?? [],
		currentPage: transactionData?.pageNumber ?? 0,
		totalRecords: transactionData?.totalItems ?? 0,
		isFetching:
			transactionIsFetching ||
			categoryIsFetching ||
			form.getValues().transactions.length === 0,
		form
	};
};
