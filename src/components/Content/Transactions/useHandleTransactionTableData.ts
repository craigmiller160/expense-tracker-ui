import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import {
	CategorizeTransactionsMutation,
	useCategorizeTransactions,
	useSearchForTransactions
} from '../../../ajaxapi/query/TransactionQueries';
import {
	SearchTransactionsResponse,
	TransactionResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { CategoryResponse } from '../../../types/categories';
import { useEffect, useMemo } from 'react';
import {
	FieldArrayWithId,
	useFieldArray,
	useForm,
	UseFormReset,
	UseFormReturn
} from 'react-hook-form';
import { CategoryOption, PaginationState } from './utils';
import { match, P } from 'ts-pattern';

export interface TransactionFormValues {
	readonly transactionId: string;
	readonly category: CategoryOption | null;
}

export interface TransactionTableForm {
	readonly transactions: ReadonlyArray<TransactionFormValues>;
}

// TODO nest the properties to organize structure
export interface TransactionTableData {
	readonly transactions: ReadonlyArray<TransactionResponse>;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly currentPage: number;
	readonly totalRecords: number;
	readonly isFetching: boolean;
	readonly form: UseFormReturn<TransactionTableForm>;
	readonly resetFormToData: () => void;
	readonly fields: ReadonlyArray<
		FieldArrayWithId<TransactionTableForm, 'transactions', 'id'>
	>;
	readonly categorizeTransactions: CategorizeTransactionsMutation;
}

const categoryToCategoryOption = (
	category: CategoryResponse
): CategoryOption => ({
	label: category.name,
	value: category.id
});

const transactionToCategoryOption = (
	transaction: TransactionResponse
): CategoryOption | null =>
	match(transaction)
		.with(
			{ categoryId: P.not(P.nullish) },
			(t): CategoryOption => ({
				value: t.categoryId!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
				label: t.categoryName! // eslint-disable-line @typescript-eslint/no-non-null-assertion
			})
		)
		.otherwise(() => null);

const transactionToFormValues = (
	transaction: TransactionResponse
): TransactionFormValues => ({
	transactionId: transaction.id,
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

const testNumberOfFormRecords = (
	form: UseFormReturn<TransactionTableForm>,
	data?: SearchTransactionsResponse
): boolean =>
	form.getValues()?.transactions?.length === 0 && (data?.totalItems ?? 0) > 0;

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
	const { mutate: categorizeTransactions } = useCategorizeTransactions();
	const form = useForm<TransactionTableForm>();
	const { fields } = useFieldArray({
		control: form.control,
		name: 'transactions'
	});

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
			testNumberOfFormRecords(form, transactionData),
		form,
		resetFormToData,
		fields,
		categorizeTransactions
	};
};
