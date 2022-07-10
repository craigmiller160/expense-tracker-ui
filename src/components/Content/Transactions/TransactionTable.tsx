import {
	createTablePagination,
	formToUpdateRequest,
	PaginationState,
	TransactionSearchForm
} from './utils';
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
import { Control, FormState } from 'react-hook-form';
import { ReactNode } from 'react';
import { Updater } from 'use-immer';
import { UpdateTransactionsMutation } from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CategoryIcon from '@mui/icons-material/Category';
import { Popover } from '../../UI/Popover';
import { ResponsiveFlagsContainer } from './responsive/ResponsiveFlagsContainer';
import { useIsAtLeastBreakpoint } from '../../../utils/useIsAtLeastBreakpoint';

const COLUMNS: ReadonlyArray<string | ReactNode> = [
	'Expense Date',
	'Description',
	'Amount',
	'Category',
	'Flags'
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
}

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

const conditionalVisible = (condition: boolean): string | undefined =>
	condition ? 'visible' : undefined;

export const TransactionTable = (props: Props) => {
	const {
		data: { transactions, categories, isFetching },
		pagination: { currentPage, totalRecords },
		form: {
			formReturn: { control, formState, handleSubmit, getValues },
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

	const belowTableActions = createBelowTableActions(
		formState,
		resetFormToData,
		editMode
	);

	const onSubmit = createOnSubmit(updateTransactions);

	const editClass = editMode ? 'edit' : '';

	const editModeColumns = createEditModeColumns(control);

	return (
		<div className={`TransactionsTable ${editClass}`}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Table
					columns={editMode ? editModeColumns : COLUMNS}
					loading={isFetching}
					pagination={tablePagination}
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
									{`$${txn.amount.toFixed(2)}`}
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
								<TableCell className="FlagsCell">
									<ResponsiveFlagsContainer>
										<Popover
											className={conditionalVisible(
												txn.duplicate
											)}
											message="Transaction is a duplicate"
											data-testid="duplicate-icon"
										>
											<FileCopyIcon color="warning" />
										</Popover>
										<Popover
											className={conditionalVisible(
												!getValues(
													`transactions.${index}.confirmed`
												)
											)}
											message="Transaction has not been confirmed"
											data-testid="not-confirmed-icon"
										>
											<ThumbDownIcon color="warning" />
										</Popover>
										<Popover
											className={conditionalVisible(
												!getValues(
													`transactions.${index}.category`
												)
											)}
											message="Transaction has not been categorized"
											data-testid="no-category-icon"
										>
											<CategoryIcon color="warning" />
										</Popover>
									</ResponsiveFlagsContainer>
								</TableCell>
							</TableRow>
						);
					})}
				</Table>
			</form>
		</div>
	);
};
