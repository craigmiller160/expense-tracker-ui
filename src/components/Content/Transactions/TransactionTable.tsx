import { createTablePagination, PaginationState } from './utils';
import {
	TransactionTableForm,
	useHandleTransactionTableData
} from './useHandleTransactionTableData';
import './TransactionsTable.scss';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import { Autocomplete } from '@craigmiller160/react-hook-form-material-ui';
import { FullPageTableWrapper } from '../../UI/Table/FullPageTableWrapper';
import { FormState } from 'react-hook-form';
import { ReactNode } from 'react';
import { Updater } from 'use-immer';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];

interface Props {
	readonly pagination: PaginationState;
	readonly updatePagination: Updater<PaginationState>;
}

const createBelowTableActions = (
	formState: FormState<TransactionTableForm>,
	resetFormToData: () => void
): ReadonlyArray<ReactNode> => [
	<Button
		variant="contained"
		color="secondary"
		disabled={!formState.isDirty}
		onClick={resetFormToData}
	>
		Reset
	</Button>,
	<Button
		variant="contained"
		type="submit"
		color="success"
		disabled={!formState.isDirty}
	>
		Save
	</Button>
];

export const TransactionTable = (props: Props) => {
	const {
		transactions,
		categories,
		isFetching,
		currentPage,
		totalRecords,
		resetFormToData,
		form: { control, formState }
	} = useHandleTransactionTableData(props.pagination);

	const tablePagination = createTablePagination(
		currentPage,
		props.pagination.pageSize,
		totalRecords,
		props.updatePagination
	);

	const belowTableActions = createBelowTableActions(
		formState,
		resetFormToData
	);

	return (
		<div className="TransactionsTable">
			<form>
				<FullPageTableWrapper data-testid="transaction-table">
					<Table
						columns={COLUMNS}
						loading={isFetching}
						pagination={tablePagination}
						belowTableActions={belowTableActions}
					>
						{transactions.map((txn, index) => (
							<TableRow key={txn.id}>
								<TableCell>{txn.expenseDate}</TableCell>
								<TableCell>{txn.description}</TableCell>
								<TableCell>{txn.amount}</TableCell>
								<TableCell>
									<Autocomplete
										name={`transactions.${index}.category`}
										control={control}
										label="Category"
										options={categories}
									/>
								</TableCell>
							</TableRow>
						))}
					</Table>
				</FullPageTableWrapper>
			</form>
		</div>
	);
};
