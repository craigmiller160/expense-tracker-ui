import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import {
	SearchTransactionsResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { Table, TablePaginationConfig } from '../../UI/Table';
import { TableCell, TableRow } from '@mui/material';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];
const ROWS_PER_PAGE = 25;
// TODO how to have configurable rows-per-page?

const toPagination = (
	data?: SearchTransactionsResponse
): TablePaginationConfig | undefined =>
	pipe(
		Option.fromNullable(data),
		Option.map(
			(values): TablePaginationConfig => ({
				totalRecords: values.totalItems,
				recordsPerPage: ROWS_PER_PAGE,
				currentPage: values.pageNumber,
				onChangePage: () => {},
				onRowsPerPageChange: () => {}
			})
		),
		Option.getOrElse((): TablePaginationConfig | undefined => undefined)
	);

export const Transactions = () => {
	const { data, isFetching } = useSearchForTransactions({
		pageSize: ROWS_PER_PAGE,
		pageNumber: 0,
		sortKey: TransactionSortKey.EXPENSE_DATE,
		sortDirection: SortDirection.ASC
	});

	const pagination = toPagination(data);

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<div className="TableWrapper">
				<Table
					columns={COLUMNS}
					loading={isFetching}
					pagination={pagination}
				>
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
