import {
	createTablePagination,
	formToCategorizeRequest,
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
	Switch
} from '@craigmiller160/react-hook-form-material-ui';
import { Control, FormState } from 'react-hook-form';
import { ReactNode } from 'react';
import { Updater } from 'use-immer';
import { CategorizeTransactionsMutation } from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CategoryIcon from '@mui/icons-material/Category';
import { Popover } from '../../UI/Popover';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category', 'Flags'];

interface Props {
	readonly pagination: PaginationState;
	readonly onPaginationChange: Updater<PaginationState>;
	readonly filterValues: TransactionSearchForm;
}

const createAboveTableActions = (control: Control<TransactionTableForm>) => [
	<Switch key="editModeSwitch" control={control} name="editMode" label="Edit Mode" />
];

const createBelowTableActions = (
	formState: FormState<TransactionTableForm>,
	resetFormToData: () => void
): ReadonlyArray<ReactNode> => [
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

const createOnSubmit =
	(categorizeTransactions: CategorizeTransactionsMutation) =>
	(values: TransactionTableForm) =>
		pipe(
			formToCategorizeRequest(values),
			(_) => ({ transactionsAndCategories: _ }),
			categorizeTransactions
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
		actions: { resetFormToData, categorizeTransactions }
	} = useHandleTransactionTableData(props.pagination, props.filterValues);

	const tablePagination = createTablePagination(
		currentPage,
		props.pagination.pageSize,
		totalRecords,
		props.onPaginationChange
	);

	const aboveTableActions = createAboveTableActions(control);
	const belowTableActions = createBelowTableActions(
		formState,
		resetFormToData
	);

	const onSubmit = createOnSubmit(categorizeTransactions);

	console.log('Values', getValues());

	return (
		<div className="TransactionsTable">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Table
					columns={COLUMNS}
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
								<TableCell className="CategoryCell">
									{/*<Autocomplete*/}
									{/*	name={`transactions.${index}.category`}*/}
									{/*	control={control}*/}
									{/*	label="Category"*/}
									{/*	options={categories}*/}
									{/*/>*/}
									{txn.categoryName}
								</TableCell>
								<TableCell className="FlagsCell">
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
											!txn.confirmed
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
								</TableCell>
							</TableRow>
						);
					})}
				</Table>
			</form>
		</div>
	);
};
