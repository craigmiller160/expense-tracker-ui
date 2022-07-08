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
import { useEffect, useMemo } from 'react';
import {
	FieldArrayWithId,
	useFieldArray,
	useForm,
	UseFormReset,
	UseFormReturn
} from 'react-hook-form';
import {
	CategoryOption,
	categoryToCategoryOption,
	PaginationState,
	TransactionSearchForm
} from './utils';
import { match, P } from 'ts-pattern';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';

const formatDisplayDate = (dateString: string) =>
	pipe(dateString, Time.parse('yyyy-MM-dd'), Time.format('MM/dd/yyyy'));

export interface TransactionFormValues {
	readonly transactionId: string;
	readonly category: CategoryOption | null;
}

export interface TransactionTableForm {
	readonly transactions: ReadonlyArray<TransactionFormValues>;
}

export interface TransactionTableData {
	readonly data: {
		readonly transactions: ReadonlyArray<TransactionResponse>;
		readonly categories: ReadonlyArray<CategoryOption>;
		readonly isFetching: boolean;
	};
	readonly pagination: {
		readonly currentPage: number;
		readonly totalRecords: number;
	};
	readonly form: {
		readonly formReturn: UseFormReturn<TransactionTableForm>;
		readonly fields: ReadonlyArray<
			FieldArrayWithId<TransactionTableForm, 'transactions', 'id'>
		>;
	};
	readonly actions: {
		readonly resetFormToData: () => void;
		readonly categorizeTransactions: CategorizeTransactionsMutation;
	};
}

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

const handleCategoryIds = (
	categoryId?: string
): ReadonlyArray<string> | undefined =>
	match(categoryId)
		.with(undefined, () => undefined)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		.otherwise(() => [categoryId!]);

export const useHandleTransactionTableData = (
	pagination: PaginationState,
	filterValues: TransactionSearchForm
): TransactionTableData => {
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const { data: transactionData, isFetching: transactionIsFetching } =
		useSearchForTransactions({
			pageNumber: pagination.pageNumber,
			pageSize: pagination.pageSize,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: filterValues.direction,
			startDate: filterValues.startDate,
			endDate: filterValues.endDate,
			categoryIds: handleCategoryIds(filterValues.category?.value),
			isConfirmed: filterValues.isNotConfirmed ? false : undefined,
			isDuplicate: filterValues.isDuplicate ? true : undefined,
			isCategorized: filterValues.isNotCategorized ? false : undefined
		});
	const { mutate: categorizeTransactions } = useCategorizeTransactions();
	const form = useForm<TransactionTableForm>({
		mode: 'onChange',
		reValidateMode: 'onChange'
	});
	const { fields } = useFieldArray({
		control: form.control,
		name: 'transactions'
	});

	const categories = useMemo(
		() => categoryData?.map(categoryToCategoryOption),
		[categoryData]
	);

	const resetFormToData = useMemo(
		() =>
			createResetFormToData(
				form.reset,
				transactionData?.transactions ?? []
			),
		[form, transactionData]
	);

	useEffect(() => {
		if (transactionData) {
			resetFormToData();
		}
	}, [transactionData, resetFormToData, transactionIsFetching]);

	useEffect(() => {
		if (transactionIsFetching) {
			form.reset({
				transactions: []
			});
		}
	}, [transactionIsFetching, form]);

	// This is here so that the icons can be updated in real time to user interaction
	form.watch();

	const transactions = useMemo(
		() =>
			transactionData?.transactions.map((txn) => ({
				...txn,
				expenseDate: formatDisplayDate(txn.expenseDate)
			})),
		[transactionData]
	);

	return {
		data: {
			transactions: transactions ?? [],
			categories: categories ?? [],
			isFetching:
				transactionIsFetching ||
				categoryIsFetching ||
				testNumberOfFormRecords(form, transactionData)
		},
		pagination: {
			currentPage: transactionData?.pageNumber ?? 0,
			totalRecords: transactionData?.totalItems ?? 0
		},
		form: {
			formReturn: form,
			fields
		},
		actions: {
			resetFormToData,
			categorizeTransactions
		}
	};
};
