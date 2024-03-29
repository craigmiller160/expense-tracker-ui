import type { ReactNode } from 'react';
import { memo, useContext } from 'react';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import {
	Autocomplete,
	Checkbox
} from '@craigmiller160/react-hook-form-material-ui';
import { formatCurrency } from '../../../utils/formatNumbers';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import { PossibleRefundIcon } from './icons/PossibleRefundIcon';
import type { Control, DeepPartial, FormState } from 'react-hook-form';
import type {
	TransactionFormValues,
	TransactionTableForm,
	TransactionTablePagination,
	TransactionTableUseFormReturn
} from './useHandleTransactionTableData';
import { useIsEditMode } from './TransactionTableUtils';
import type { UseMutateFunction } from '@tanstack/react-query';
import type {
	DeleteTransactionsResponse,
	TransactionResponse
} from '../../../types/generated/expense-tracker';
import type { NewConfirmDialog } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialogContext } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { useDeleteAllUnconfirmed } from '../../../ajaxapi/query/TransactionQueries';
import type { CategoryOption } from '../../../types/categories';
import type { PaginationState } from '../../../utils/pagination';
import { createTablePagination } from '../../../utils/pagination';
import type { Updater } from 'use-immer';

export type Props = Readonly<{
	transactions: ReadonlyArray<TransactionResponse>;
	categories: ReadonlyArray<CategoryOption>;
	watchedTransactions: ReadonlyArray<DeepPartial<TransactionFormValues>>;
	form: TransactionTableUseFormReturn;
	onSubmit: (f: TransactionTableForm) => void;
	isFetching: boolean;
	openDetailsDialog: (transactionId?: string) => void;
	resetFormToData: () => void;
	pagination: TransactionTablePagination;
	onPaginationChange: Updater<PaginationState>;
}>;

const COLUMNS: ReadonlyArray<string | ReactNode> = [
	'Expense Date',
	'Description',
	'Amount',
	'Category',
	'Flags',
	'Details'
];

const createEditModeColumns = (
	control: Control<TransactionTableForm>
): ReadonlyArray<string | ReactNode> => [
	<Checkbox
		className="confirm-all-checkbox"
		key="confirmAll"
		control={control}
		name="confirmAll"
		label="Confirm All"
		labelPlacement="top"
	/>,
	...COLUMNS
];

export const arePropsEqual = (prevProps: Props, nextProps: Props): boolean => {
	const nextPropsEntries = Object.entries(nextProps) as ReadonlyArray<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[keyof Props, any]
	>;

	return (
		nextPropsEntries.filter(([key, value]) => {
			if (typeof value === 'function') {
				return false;
			}

			return value !== prevProps[key];
		}).length === 0
	);
};

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

export const TransactionTable = memo((props: Props) => {
	const editMode = useIsEditMode();
	const editClass = editMode ? 'edit' : '';
	const {
		transactions,
		categories,
		watchedTransactions,
		form: {
			formReturn: { control, handleSubmit, formState },
			fields
		},
		onSubmit,
		isFetching,
		openDetailsDialog,
		resetFormToData,
		pagination: { currentPage, totalRecords, pageSize },
		onPaginationChange
	} = props;

	const editModeColumns = createEditModeColumns(control);

	const { newConfirmDialog } = useContext(ConfirmDialogContext);
	const { mutate: deleteAllUnconfirmed } = useDeleteAllUnconfirmed();

	const aboveTableActions = createAboveTableActions(
		openDetailsDialog,
		deleteAllUnconfirmed,
		newConfirmDialog
	);
	const belowTableActions = createBelowTableActions(
		formState,
		resetFormToData,
		editMode
	);

	const tablePagination = createTablePagination(
		currentPage,
		pageSize,
		totalRecords,
		onPaginationChange
	);

	return (
		<div className={`transactions-table ${editClass}`}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Table
					columns={editMode ? editModeColumns : COLUMNS}
					loading={isFetching}
					pagination={tablePagination}
					aboveTableActions={aboveTableActions}
					belowTableActions={belowTableActions}
					data-testid="transactions-table"
				>
					{fields.map((field, index) => {
						const txn = transactions[index];
						if (!txn) {
							return <span key={index}></span>;
						}
						return (
							<TableRow
								key={txn.id}
								data-testid="transaction-table-row"
							>
								{editMode && (
									<TableCell className="confirmed-cell">
										{!txn.confirmed && (
											<Checkbox
												testId="confirm-transaction-checkbox"
												control={control}
												name={`transactions.${index}.confirmed`}
												label=""
												labelPlacement="top"
											/>
										)}
									</TableCell>
								)}
								<TableCell data-testid="transaction-expense-date">
									{txn.expenseDate}
								</TableCell>
								<TableCell
									className="description-cell"
									data-testid="transaction-description"
								>
									{txn.description}
								</TableCell>
								<TableCell>
									{formatCurrency(txn.amount)}
								</TableCell>
								<TableCell
									className={`category-cell ${editClass}`}
								>
									{editMode && (
										<Autocomplete
											testId="transaction-category-select"
											name={`transactions.${index}.category`}
											control={control}
											label="Category"
											options={categories}
										/>
									)}
									{!editMode && txn.categoryName}
								</TableCell>
								<TableCell>
									<div className="flags-wrapper">
										<div className="flag-row">
											<NotConfirmedIcon
												transaction={
													watchedTransactions[index]
												}
											/>
											<DuplicateIcon transaction={txn} />
										</div>
										<div className="flag-row">
											<NotCategorizedIcon
												transaction={
													watchedTransactions[index]
												}
											/>
											<PossibleRefundIcon
												transaction={txn}
											/>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Button
										className="DetailsButton"
										variant="contained"
										color="info"
										disabled={formState.isDirty}
										onClick={() =>
											openDetailsDialog(txn.id)
										}
									>
										Details
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</Table>
			</form>
		</div>
	);
}, arePropsEqual);
TransactionTable.displayName = 'TransactionTable';
