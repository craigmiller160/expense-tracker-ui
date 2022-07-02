import { PaginationState } from './utils';
import {
	createTransactionFormKey,
	useHandleTransactionTableData
} from './useHandleTransactionTableData';
import './TransactionsTable.scss';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import { Autocomplete } from '@craigmiller160/react-hook-form-material-ui';
import { FullPageTableWrapper } from '../../UI/Table/FullPageTableWrapper';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];

interface Props {
	readonly pagination: PaginationState;
}

export const TransactionTable = (props: Props) => {
	const {
		transactions,
		categories,
		isFetching,
		form: { control, formState }
	} = useHandleTransactionTableData(props.pagination);

	const belowTableActions = [
		<Button
			variant="contained"
			color="secondary"
			disabled={!formState.isDirty}
		>
			Cancel
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

	return (
		<div className="TransactionsTable">
			<form>
				<FullPageTableWrapper data-testid="transaction-table">
					<Table
						columns={COLUMNS}
						loading={isFetching}
						pagination={pagination}
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
