import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import {
	UpdateTransactionsMutation,
	useDeleteAllUnconfirmed,
	useDeleteTransactions,
	useSearchForTransactions,
	useUpdateTransactions
} from '../../../ajaxapi/query/TransactionQueries';
import { TransactionSortKey } from '../../../types/misc';
import { useEffect, useMemo } from 'react';
import {
	FieldArrayWithId,
	useFieldArray,
	useForm,
	UseFormReset,
	UseFormReturn
} from 'react-hook-form';
import { TransactionSearchForm } from './utils';
import { match } from 'ts-pattern';
import {
	TransactionResponse,
	TransactionsPageResponse
} from '../../../types/generated/expense-tracker';
import { serverDateToDisplayDate } from '../../../utils/dateTimeUtils';
import { PaginationState } from '../../../utils/pagination';
import { CategoryOption } from '../../../types/categories';
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
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
			confirmed: filterValues.confirmed,
			duplicate: filterValues.duplicate,
			categorized: filterValues.categorized,
			possibleRefund: filterValues.possibleRefund
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
			updateTransactions
		}
	};
};
