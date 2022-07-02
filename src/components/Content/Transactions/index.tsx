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
import { Updater, useImmer } from 'use-immer';
import { FullPageTableWrapper } from '../../UI/Table/FullPageTableWrapper';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';

const COLUMNS = ['Expense Date', 'Description', 'Amount'];
const DEFAULT_ROWS_PER_PAGE = 25;

interface State {
	readonly pageNumber: number;
	readonly pageSize: number;
}

const toPagination = (
	pageSize: number,
	setState: Updater<State>,
	data?: SearchTransactionsResponse
): TablePaginationConfig | undefined =>
	pipe(
		Option.fromNullable(data),
		Option.map(
			(values): TablePaginationConfig => ({
				totalRecords: values.totalItems,
				recordsPerPage: pageSize,
				currentPage: parseInt(`${values.pageNumber}`),
				onChangePage: (_, pageNumber) =>
					setState((draft) => {
						draft.pageNumber = pageNumber;
					}),
				onRecordsPerPageChange: (event) =>
					setState((draft) => {
						draft.pageSize = parseInt(event.target.value, 10);
					})
			})
		),
		Option.getOrElse((): TablePaginationConfig | undefined => undefined)
	);

export const Transactions = () => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const { data: categoryData, isFetching: categoryIsFetching } = useGetAllCategories();
	const { data: transactionData, isFetching: transactionIsFetching } =
		useSearchForTransactions({
			...state,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});

	const pagination = toPagination(state.pageSize, setState, transactionData);

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<FullPageTableWrapper data-testid="transaction-table">
				<Table
					columns={COLUMNS}
					loading={transactionIsFetching}
					pagination={pagination}
				>
					{(transactionData?.transactions ?? []).map((txn) => (
						<TableRow key={txn.id}>
							<TableCell>{txn.expenseDate}</TableCell>
							<TableCell>{txn.description}</TableCell>
							<TableCell>{txn.amount}</TableCell>
						</TableRow>
					))}
				</Table>
			</FullPageTableWrapper>
		</div>
	);
};
