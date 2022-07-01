import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import { TransactionSortKey } from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { Table } from '../../UI/Table';
import { TableCell, TableRow } from '@mui/material';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];
const ROWS_PER_PAGE = 20;

export const Transactions = () => {
	const { data, isFetching } = useSearchForTransactions({
		pageSize: ROWS_PER_PAGE,
		pageNumber: 0,
		sortKey: TransactionSortKey.EXPENSE_DATE,
		sortDirection: SortDirection.ASC
	});
	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<div className="TableWrapper">
				<Table columns={COLUMNS} loading={isFetching}>
					{(data?.transactions ?? []).map((txn) => (
						<TableRow key={txn.id}>
							<TableCell>{txn.expenseDate}</TableCell>
							<TableCell>{txn.description}</TableCell>
							<TableCell>{txn.amount}</TableCell>
							<TableCell>{txn.categoryName}</TableCell>
						</TableRow>
					))}
				</Table>
			</div>
		</div>
	);
};
