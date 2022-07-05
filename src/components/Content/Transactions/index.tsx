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
import { useForm } from 'react-hook-form';
import { useForceUpdate } from '../../../utils/useForceUpdate';

export const Transactions = () => {
	const [paginationState, setPaginationState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const forceUpdate = useForceUpdate();

	const { control, handleSubmit, getValues } = useForm<TransactionSearchForm>(
		{
			mode: 'onBlur',
			reValidateMode: 'onChange',
			defaultValues: transactionSearchFormDefaultValues
		}
	);

	const dynamicSubmit = handleSubmit(forceUpdate);

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<TransactionSearchFilters
				control={control}
				dynamicSubmit={dynamicSubmit}
				getValues={getValues}
			/>
			<TransactionTable
				filterValues={getValues()}
				pagination={paginationState}
				onPaginationChange={setPaginationState}
			/>
		</div>
	);
};
