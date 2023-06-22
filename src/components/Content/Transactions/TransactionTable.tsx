import { formToUpdateRequest, TransactionSearchForm } from './utils';
import {
	TransactionTableForm,
	useHandleTransactionTableData
} from './useHandleTransactionTableData';
import './TransactionsTable.scss';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import {
	Autocomplete,
	Checkbox
} from '@craigmiller160/react-hook-form-material-ui';
import {
	Control,
	FieldPath,
	FormState,
	UseFormSetValue,
	UseFormWatch
} from 'react-hook-form';
import { ReactNode, useContext, useEffect } from 'react';
import { Updater } from 'use-immer';
import {
	UpdateTransactionsMutation,
	useDeleteAllUnconfirmed
} from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import { useIsAtLeastBreakpoint } from '../../../utils/breakpointHooks';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import { formatCurrency } from '../../../utils/formatNumbers';
import { PossibleRefundIcon } from './icons/PossibleRefundIcon';
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
		className="ConfirmAllCheckbox"
		key="confirmAll"
		control={control}
		name="confirmAll"
		label="Confirm All"
		labelPlacement="top"
	/>,
	...COLUMNS
];

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
			key="delete-all-unconfirmed"
			variant="contained"
			color="error"
			onClick={onDeleteAllUnconfirmedClick}
		>
			Delete All Unconfirmed
		</Button>,
		<Button
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

export const TransactionTable = (props: Props) => {
	const { newConfirmDialog } = useContext(ConfirmDialogContext);
	const {
		data: { transactions, categories, isFetching },
		pagination: { currentPage, totalRecords },
		form: {
			formReturn: { setValue, control, formState, handleSubmit, watch },
			fields
		},
		actions: { resetFormToData, updateTransactions }
	} = useHandleTransactionTableData(props.pagination, props.filterValues);

	const tablePagination = createTablePagination(
		currentPage,
		props.pagination.pageSize,
		totalRecords,
		props.onPaginationChange
	);
	const isAtLeastSm = useIsAtLeastBreakpoint('sm');
	const editMode = process.env.NODE_ENV === 'test' || isAtLeastSm;

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

	const editClass = editMode ? 'edit' : '';

	const editModeColumns = createEditModeColumns(control);
	const watchedTransactions = watch('transactions');

	useAutoConfirmOnCategorize(watch, setValue);

	return (
		<div className={`TransactionsTable ${editClass}`}>
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
									<TableCell className="ConfirmedCell">
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
									className="DescriptionCell"
									data-testid="transaction-description"
								>
									{txn.description}
								</TableCell>
								<TableCell>
									{formatCurrency(txn.amount)}
								</TableCell>
								<TableCell
									className={`CategoryCell ${editClass}`}
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
									<div className="FlagsWrapper">
										<div className="FlagRow">
											<NotConfirmedIcon
												transaction={
													watchedTransactions[index]
												}
											/>
											<DuplicateIcon transaction={txn} />
										</div>
										<div className="FlagRow">
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
											props.openDetailsDialog(txn.id)
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
};
