import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import {
	TransactionResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { CategoryResponse } from '../../../types/categories';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReset, UseFormReturn } from 'react-hook-form';
import { CategoryOption, PaginationState } from './utils';
import { match, P } from 'ts-pattern';

export interface TransactionFormValues {
	readonly category?: CategoryOption;
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
): CategoryOption | undefined =>
	match(transaction)
		.with(
			{ categoryId: P.not(P.nullish) },
			(t): CategoryOption => ({
				value: t.categoryId!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
				label: t.categoryName! // eslint-disable-line @typescript-eslint/no-non-null-assertion
			})
		)
		.otherwise(() => undefined);

const transactionToFormValues = (
	transaction: TransactionResponse
): TransactionFormValues => ({
	category: transactionToCategoryOption(transaction)
});

const createResetFormToData =
	(
		reset: UseFormReset<TransactionTableForm>,
		transactions: ReadonlyArray<TransactionResponse>
	) =>
	() => {
		const formValues = transactions.map(transactionToFormValues);
		reset({
			transactions: formValues
		});
	};

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

	const resetFormToData = createResetFormToData(
		form.reset,
		transactionData?.transactions ?? []
	);

	useEffect(() => {
		if (transactionData) {
			resetFormToData();
		}
	}, [transactionData, transactionIsFetching]);

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
			form.getValues()?.transactions?.length === 0,
		form
	};
};
