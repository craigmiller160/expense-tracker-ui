import { useGetPossibleDuplicates } from '../../../ajaxapi/query/TransactionQueries';
import { Table } from '../../UI/Table';
import { Typography } from '@mui/material';
import './TransactionDetailsDuplicatePanel.scss';
import { createTablePagination, PaginationState } from './utils';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';

type Props = {
	readonly transactionId: string;
};
type State = PaginationState;

const COLUMNS = ['Expense Date', 'Amount', 'Description', 'Category'];

export const TransactionDetailsDuplicatePanel = (props: Props) => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: 5
	});
	// TODO need pagination to be better
	const { data, isFetching } = useGetPossibleDuplicates(
		props.transactionId,
		0,
		25
	);

	const tablePagination = useMemo(
		() =>
			createTablePagination(
				state.pageNumber,
				state.pageSize,
				data?.totalItems ?? 0,
				setState
			),
		[data, state, setState]
	);

	return (
		<div className="TransactionDetailsDuplicatePanel">
			<Typography variant="h5" className="header">
				Duplicates
			</Typography>
			<Table
				columns={COLUMNS}
				loading={isFetching}
				pagination={tablePagination}
				data-testid="transaction-duplicates-table"
			></Table>
		</div>
	);
};
