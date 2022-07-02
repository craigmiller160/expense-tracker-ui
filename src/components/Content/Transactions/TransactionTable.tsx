import { PaginationState } from './utils';
import { useHandleTransactionTableData } from './useHandleTransactionTableData';
import './TransactionsTable.scss';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];

interface Props {
	readonly pagination: PaginationState;
}

export const TransactionTable = (props: Props) => {
	useHandleTransactionTableData(props.pagination);

	return (
		<div className="TransactionsTable">
			<form>

			</form>
		</div>
	)
};
