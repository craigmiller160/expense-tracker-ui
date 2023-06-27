import { formToUpdateRequest, TransactionSearchForm } from './utils';
import {
	TransactionTableForm,
	useHandleTransactionTableData
} from './useHandleTransactionTableData';
import './TransactionsTable.scss';
import { Button, TableCell, TableRow } from '@mui/material';
import {
	Control,
	FieldPath,
	FormState,
	UseFormSetValue,
	UseFormWatch,
	useWatch
} from 'react-hook-form';
import { ReactNode, useContext, useEffect, useMemo } from 'react';
import { Updater } from 'use-immer';
import {
	UpdateTransactionsMutation,
	useDeleteAllUnconfirmed
} from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { UseMutateFunction } from '@tanstack/react-query';
import { DeleteTransactionsResponse } from '../../../types/generated/expense-tracker';
import {
	ConfirmDialogContext,
	NewConfirmDialog
} from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { TransactionTable } from './TransactionTable';
import { useIsEditMode } from './TransactionTableUtils';

interface Props {
	readonly pagination: PaginationState;
	readonly onPaginationChange: Updater<PaginationState>;
	readonly filterValues: TransactionSearchForm;
	readonly openDetailsDialog: (transactionId?: string) => void;
}

const createAboveTableActions = (
	openDetailsDialog: () => void,
	deleteAllUnconfirmed: UseMutateFunction<DeleteTransactionsResponse>,
	newConfirmDialog: NewConfirmDialog
): ReadonlyArray<ReactNode> => {
	const onDeleteAllUnconfirmedClick = () =>
		newConfirmDialog(
			'Delete All Unconfirmed Transactions',
			'This will delete all unconfirmed transactions regardless of filter settings. Are you sure you want to proceed?',
			deleteAllUnconfirmed
		);
	return [
		<Button
			id="delete-all-unconfirmed-transactions-button"
			key="delete-all-unconfirmed"
			variant="contained"
			color="error"
			onClick={onDeleteAllUnconfirmedClick}
		>
			Delete All Unconfirmed Transactions
		</Button>,
		<Button
			id="add-transaction-button"
			key="add-transaction"
			variant="contained"
			color="primary"
			onClick={() => openDetailsDialog()}
		>
			Add Transaction
		</Button>
	];
};

const createBelowTableActions = (
	formState: FormState<TransactionTableForm>,
	resetFormToData: () => void,
	editMode: boolean
): ReadonlyArray<ReactNode> => {
	if (!editMode) {
		return [];
	}
	return [
		<Button
			key="reset-button"
			variant="contained"
			color="secondary"
			disabled={!formState.isDirty}
			onClick={resetFormToData}
		>
			Reset
		</Button>,
		<Button
			key="save-button"
			variant="contained"
			type="submit"
			color="success"
			disabled={!formState.isDirty}
		>
			Save
		</Button>
	];
};

const createOnSubmit =
	(updateTransactions: UpdateTransactionsMutation) =>
	(values: TransactionTableForm) =>
		pipe(
			formToUpdateRequest(values),
			(_) => ({ transactions: _ }),
			updateTransactions
		);

const CATEGORIZE_TRANSACTION_REGEX = /transactions\.(?<index>\d+)\.category/;
type CategorizeTransactionRegexGroups = {
	readonly index: string;
};
const useAutoConfirmOnCategorize = (
	watch: UseFormWatch<TransactionTableForm>,
	setValue: UseFormSetValue<TransactionTableForm>
) => {
	useEffect(() => {
		const subscription = watch((values, { name }) => {
			if (name) {
				const groups = CATEGORIZE_TRANSACTION_REGEX.exec(name)
					?.groups as CategorizeTransactionRegexGroups | undefined;
				if (groups) {
					const confirmedKey =
						`transactions.${groups.index}.confirmed` as FieldPath<TransactionTableForm>;
					setValue(confirmedKey, true);
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, setValue]);
};

export const TransactionTableWrapper = (props: Props) => {
	const { newConfirmDialog } = useContext(ConfirmDialogContext);
	const {
		data: { transactions, categories, isFetching },
		pagination: { currentPage, totalRecords },
		form,
		actions: { resetFormToData, updateTransactions }
	} = useHandleTransactionTableData(props.pagination, props.filterValues);
	const {
		formReturn: { setValue, control, formState, handleSubmit, watch },
		fields
	} = form;

	const tablePagination = createTablePagination(
		currentPage,
		props.pagination.pageSize,
		totalRecords,
		props.onPaginationChange
	);
	const editMode = useIsEditMode();

	const { mutate: deleteAllUnconfirmed } = useDeleteAllUnconfirmed();

	const aboveTableActions = createAboveTableActions(
		props.openDetailsDialog,
		deleteAllUnconfirmed,
		newConfirmDialog
	);
	const belowTableActions = createBelowTableActions(
		formState,
		resetFormToData,
		editMode
	);

	const onSubmit = createOnSubmit(updateTransactions);

	const { transactions: watchedTransactions = [] } =
		useWatch<TransactionTableForm>({
			control
		});

	useAutoConfirmOnCategorize(watch, setValue);

	return (
		<TransactionTable
			watchedTransactions={watchedTransactions}
			form={form}
			onSubmit={onSubmit}
		/>
	);
};
