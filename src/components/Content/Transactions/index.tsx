import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { useImmer } from 'use-immer';
import {
	DEFAULT_ROWS_PER_PAGE,
	PaginationState,
	TransactionSearchForm,
	transactionSearchFormDefaultValues
} from './utils';
import { TransactionTable } from './TransactionTable';
import { TransactionSearchFilters } from './TransactionSearchFilters';

type CombinedPaginationState = PaginationState & TransactionSearchForm;

export const Transactions = () => {
	const [state, setState] = useImmer<CombinedPaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE,
		...transactionSearchFormDefaultValues
	});

	const onFilterChange = (values: TransactionSearchForm) =>
		setState((draft) => {
			draft.direction = values.direction;
			draft.startDate = values.startDate;
			draft.endDate = values.endDate;
			draft.categoryType = values.categoryType;
			draft.category = values.category;
		});

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<TransactionSearchFilters onFilterChange={onFilterChange} />
			<TransactionTable
				pagination={state}
				onPaginationChange={setState}
			/>
		</div>
	);
};
