import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { useSearchForTransactions } from '../../../ajaxapi/query/TransactionQueries';
import {
	SearchTransactionsResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { Table, TablePaginationConfig } from '../../UI/Table';
import { Button, CircularProgress, TableCell, TableRow } from '@mui/material';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { Updater, useImmer } from 'use-immer';
import { FullPageTableWrapper } from '../../UI/Table/FullPageTableWrapper';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { CategoryResponse } from '../../../types/categories';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { useForm } from 'react-hook-form';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];
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

const categoryToSelectOption = (
	category: CategoryResponse
): SelectOption<string> => ({
	label: category.name,
	value: category.id
});

export const Transactions = () => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const { data: transactionData, isFetching: transactionIsFetching } =
		useSearchForTransactions({
			...state,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});
	const { control, handleSubmit } = useForm();

	const pagination = toPagination(state.pageSize, setState, transactionData);
	const categoryOptions = categoryData?.map(categoryToSelectOption) ?? [];

	const onSetCategorySubmit = (values: any) =>
		console.log('CategorySubmit', values);

	const belowTableActions = [
		<Button variant="contained" color="secondary">
			Clear
		</Button>,
		<Button variant="contained" type="submit" color="success">
			Save
		</Button>
	];

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<form onSubmit={handleSubmit(onSetCategorySubmit)}>
				<FullPageTableWrapper data-testid="transaction-table">
					<Table
						columns={COLUMNS}
						loading={transactionIsFetching}
						pagination={pagination}
						belowTableActions={belowTableActions}
					>
						{(transactionData?.transactions ?? []).map((txn) => (
							<TableRow key={txn.id}>
								<TableCell>{txn.expenseDate}</TableCell>
								<TableCell>{txn.description}</TableCell>
								<TableCell>{txn.amount}</TableCell>
								<TableCell>
									{categoryIsFetching && <CircularProgress />}
									{!categoryIsFetching && (
										<Autocomplete
											name=""
											control={control}
											label="Category"
											options={categoryOptions}
										/>
									)}
								</TableCell>
							</TableRow>
						))}
					</Table>
				</FullPageTableWrapper>
			</form>
		</div>
	);
};
