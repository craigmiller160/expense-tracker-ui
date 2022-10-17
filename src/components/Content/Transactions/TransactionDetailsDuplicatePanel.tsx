import { useGetPossibleDuplicates } from '../../../ajaxapi/query/TransactionQueries';
import { Table } from '../../UI/Table';
import { TableCell, TableRow, Typography } from '@mui/material';
import './TransactionDetailsDuplicatePanel.scss';
import { createTablePagination, PaginationState } from './utils';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { serverDateTimeToDisplayDateTime } from '../../../utils/dateTimeUtils';

type Props = {
	readonly transactionId: string;
};
type State = PaginationState;

const COLUMNS = ['Created', 'Updated', 'Category'];

export const TransactionDetailsDuplicatePanel = (props: Props) => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: 5
	});
	const { data, isFetching } = useGetPossibleDuplicates(
		props.transactionId,
		state.pageNumber,
		state.pageSize
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
				All Duplicates
			</Typography>
			<Table
				columns={COLUMNS}
				loading={isFetching}
				pagination={tablePagination}
				data-testid="transaction-duplicates-table"
			>
				{data?.transactions?.map((txn) => (
					<TableRow
						key={txn.id}
						data-testid="transaction-duplicate-row"
					>
						<TableCell>
							{serverDateTimeToDisplayDateTime(txn.created)}
						</TableCell>
						<TableCell>
							{serverDateTimeToDisplayDateTime(txn.updated)}
						</TableCell>
						<TableCell>{txn.categoryName}</TableCell>
					</TableRow>
				))}
			</Table>
		</div>
	);
};
