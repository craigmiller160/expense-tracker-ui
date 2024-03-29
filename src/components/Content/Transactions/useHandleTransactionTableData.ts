import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import type { UpdateTransactionsMutation } from '../../../ajaxapi/query/TransactionQueries';
import {
	useDeleteAllUnconfirmed,
	useDeleteTransactions,
	useSearchForTransactions,
	useUpdateTransactions
} from '../../../ajaxapi/query/TransactionQueries';
import { TransactionSortKey } from '../../../types/misc';
import { useEffect, useMemo } from 'react';
import type {
	FieldArrayWithId,
	UseFormReset,
	UseFormReturn
} from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import type { TransactionSearchForm } from './utils';
import { match } from 'ts-pattern';
import type {
	TransactionResponse,
	TransactionsPageResponse
} from '../../../types/generated/expense-tracker';
import { serverDateToDisplayDate } from '../../../utils/dateTimeUtils';
import type { PaginationState } from '../../../utils/pagination';
import type { CategoryOption } from '../../../types/categories';
import {
	itemWithCategoryToCategoryOption,
	useCategoriesToCategoryOptions
} from '../../../utils/categoryUtils';

export interface TransactionFormValues {
	readonly transactionId: string;
	readonly confirmed: boolean;
	readonly category: CategoryOption | null;
}

export interface TransactionTableForm {
	readonly confirmAll: boolean;
	readonly transactions: ReadonlyArray<TransactionFormValues>;
}

export type TransactionTableUseFormReturn = Readonly<{
	formReturn: UseFormReturn<TransactionTableForm>;
	fields: ReadonlyArray<
		FieldArrayWithId<TransactionTableForm, 'transactions', 'id'>
	>;
}>;

export type TransactionTablePagination = Readonly<{
	currentPage: number;
	totalRecords: number;
	pageSize: number;
}>;

export interface TransactionTableData {
	readonly data: {
		readonly transactions: ReadonlyArray<TransactionResponse>;
		readonly categories: ReadonlyArray<CategoryOption>;
		readonly isFetching: boolean;
	};
	readonly pagination: TransactionTablePagination;
	readonly form: TransactionTableUseFormReturn;
	readonly actions: {
		readonly resetFormToData: () => void;
		readonly updateTransactions: UpdateTransactionsMutation;
	};
}

const transactionToFormValues = (
	transaction: TransactionResponse
): TransactionFormValues => ({
	transactionId: transaction.id,
	category: itemWithCategoryToCategoryOption(transaction),
	confirmed: transaction.confirmed
});

const createResetFormToData =
	(
		reset: UseFormReset<TransactionTableForm>,
		transactions: ReadonlyArray<TransactionResponse>
	) =>
	() => {
		const formValues = transactions.map(transactionToFormValues);
		reset({
			confirmAll: false,
			transactions: formValues
		});
	};

const testNumberOfFormRecords = (
	form: UseFormReturn<TransactionTableForm>,
	data?: TransactionsPageResponse
): boolean =>
	form.getValues()?.transactions?.length === 0 && (data?.totalItems ?? 0) > 0;

const handleCategoryIds = (
	categoryId?: string
): ReadonlyArray<string> | undefined =>
	match(categoryId)
		.with(undefined, () => undefined)

		.otherwise(() => [categoryId!]);

const handleConfirmAll = (form: UseFormReturn<TransactionTableForm>) => {
	const allValues = form.getValues();
	form.reset(
		{
			...allValues,
			transactions: allValues.transactions.map(
				(txn: TransactionFormValues): TransactionFormValues => ({
					...txn,
					confirmed: allValues.confirmAll
				})
			)
		},
		{
			keepDefaultValues: true,
			keepErrors: true,
			keepDirty: true,
			keepTouched: true,
			keepIsValid: true
		}
	);
};

export const useHandleTransactionTableData = (
	paginationState: PaginationState,
	filterValues: TransactionSearchForm
): TransactionTableData => {
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const { data: transactionData, isFetching: transactionIsFetching } =
		useSearchForTransactions({
			pageNumber: paginationState.pageNumber,
			pageSize: paginationState.pageSize,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: filterValues.direction,
			startDate: filterValues.startDate,
			endDate: filterValues.endDate,
			categoryIds: handleCategoryIds(filterValues.category?.value),
			confirmed: filterValues.confirmed,
			duplicate: filterValues.duplicate,
			categorized: filterValues.categorized,
			possibleRefund: filterValues.possibleRefund,
			description: filterValues.description
		});
	const { mutate: updateTransactions, isLoading: updateIsLoading } =
		useUpdateTransactions();
	const { isLoading: deleteIsLoading } = useDeleteTransactions();
	const { isLoading: deleteUnconfirmedIsLoading } = useDeleteAllUnconfirmed();
	const form = useForm<TransactionTableForm>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		defaultValues: {
			confirmAll: false
		}
	});
	const { fields } = useFieldArray({
		control: form.control,
		name: 'transactions'
	});

	const categories = useCategoriesToCategoryOptions(categoryData);

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
				confirmAll: false,
				transactions: []
			});
		}
	}, [transactionIsFetching, form]);

	useEffect(() => {
		const subscription = form.watch((values, info) => {
			if (info.name === 'confirmAll') {
				handleConfirmAll(form);
			}
		});
		return subscription.unsubscribe;
	}, [form]);

	const transactions = useMemo(
		() =>
			transactionData?.transactions.map((txn) => ({
				...txn,
				expenseDate: serverDateToDisplayDate(txn.expenseDate)
			})),
		[transactionData]
	);

	const pagination: TransactionTablePagination = useMemo(
		() => ({
			currentPage: transactionData?.pageNumber ?? 0,
			totalRecords: transactionData?.totalItems ?? 0,
			pageSize: paginationState.pageSize
		}),
		[transactionData, paginationState.pageSize]
	);

	const tableForm: TransactionTableUseFormReturn = useMemo(
		() => ({
			formReturn: form,
			fields
		}),
		[form, fields]
	);

	return {
		data: {
			transactions: transactions ?? [],
			categories,
			isFetching:
				transactionIsFetching ||
				categoryIsFetching ||
				testNumberOfFormRecords(form, transactionData) ||
				updateIsLoading ||
				deleteIsLoading ||
				deleteUnconfirmedIsLoading
		},
		pagination,
		form: tableForm,
		actions: {
			resetFormToData,
			updateTransactions
		}
	};
};
