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
import { useCallback, useState } from 'react';

// TODO if it works, move to separate file
type ForceUpdate = () => void;
const useForceUpdate = (): ForceUpdate => {
	const [, setState] = useState<number>(0);
	return useCallback(() => setState((prev) => prev + 1), [setState]);
};

export const Transactions = () => {
	const [paginationState, setPaginationState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const forceUpdate = useForceUpdate();

	const { control, handleSubmit } = useForm<TransactionSearchForm>({
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: transactionSearchFormDefaultValues
	});

	const dynamicSubmit = handleSubmit(forceUpdate);

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<TransactionSearchFilters
				control={control}
				dynamicSubmit={dynamicSubmit}
			/>
			<TransactionTable
				pagination={paginationState}
				onPaginationChange={setPaginationState}
			/>
		</div>
	);
};
