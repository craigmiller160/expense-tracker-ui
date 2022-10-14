import { useGetPossibleDuplicates } from '../../../ajaxapi/query/TransactionQueries';
import { Table } from '../../UI/Table';
import { Typography } from '@mui/material';
import './TransactionDetailsDuplicatePanel.scss';

type Props = {
	readonly transactionId: string;
};

const COLUMNS = ['Expense Date', 'Amount', 'Description', 'Category'];

export const TransactionDetailsDuplicatePanel = (props: Props) => {
	// TODO need pagination to be better
	const { data, isFetching } = useGetPossibleDuplicates(
		props.transactionId,
		0,
		25
	);

	return (
		<div className="TransactionDetailsDuplicatePanel">
			<Typography variant="h5" className="header">Duplicates</Typography>
			<Table
				columns={COLUMNS}
				loading={isFetching}
				data-testid="transaction-duplicates-table"
			></Table>
		</div>
	);
};
