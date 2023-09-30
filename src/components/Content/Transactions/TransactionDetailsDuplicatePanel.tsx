import {
	useGetPossibleDuplicates,
	useMarkNotDuplicate
} from '../../../ajaxapi/query/TransactionQueries';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow, Typography } from '@mui/material';
import './TransactionDetailsDuplicatePanel.scss';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { serverDateTimeToDisplayDateTime } from '../../../utils/dateTimeUtils';
import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';

type Props = {
	readonly transactionId: string;
	readonly updateSelectedTransactionId: (id: string) => void;
};
type State = PaginationState;

const COLUMNS = ['Created', 'Updated', 'Category', 'Confirmed', 'Actions'];

export const TransactionDetailsDuplicatePanel = (props: Props) => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: 10
	});
	const { data, isFetching } = useGetPossibleDuplicates(
		props.transactionId,
		state.pageNumber,
		state.pageSize
	);
	const { mutate } = useMarkNotDuplicate();

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
		<div className="transaction-details-duplicate-panel">
			<Typography variant="h5" className="header">
				Possible Duplicates
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
						<TableCell>{txn.confirmed ? 'Yes' : 'No'}</TableCell>
						<TableCell>
							<Button
								variant="contained"
								onClick={() =>
									props.updateSelectedTransactionId(txn.id)
								}
							>
								Open
							</Button>
						</TableCell>
					</TableRow>
				))}
			</Table>
			<div className="mark-not-duplicate-selection">
				<Button
					variant="contained"
					onClick={() =>
						mutate({
							id: props.transactionId
						})
					}
				>
					This is Not a Duplicate
				</Button>
			</div>
		</div>
	);
};
