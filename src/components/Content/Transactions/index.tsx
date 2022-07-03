import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { useImmer } from 'use-immer';
import { DEFAULT_ROWS_PER_PAGE, PaginationState } from './utils';
import { TransactionTable } from './TransactionTable';
import { TransactionSearchFilters } from './TransactionSearchFilters';

export const Transactions = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<TransactionSearchFilters />
			<TransactionTable pagination={state} updatePagination={setState} />
		</div>
	);
};
