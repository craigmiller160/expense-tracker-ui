import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { Updater, useImmer } from 'use-immer';
import {
	DEFAULT_ROWS_PER_PAGE,
	PaginationState,
	TransactionSearchForm,
	transactionSearchFormDefaultValues
} from './utils';
import { TransactionTable } from './TransactionTable';
import { TransactionSearchFilters } from './TransactionSearchFilters';
import { useForm, UseFormHandleSubmit } from 'react-hook-form';
import { ForceUpdate, useForceUpdate } from '../../../utils/useForceUpdate';
import { NeedsAttentionNotice } from './NeedsAttentionNotice';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';

const createOnValueHasChanged = (
	handleSubmit: UseFormHandleSubmit<TransactionSearchForm>,
	setPaginationState: Updater<PaginationState>,
	forceUpdate: ForceUpdate
) =>
	handleSubmit(() =>
		setPaginationState((draft) => {
			if (draft.pageNumber === 0) {
				forceUpdate();
			} else {
				draft.pageNumber = 0;
			}
		})
	);

export const Transactions = () => {
	const [paginationState, setPaginationState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const forceUpdate = useForceUpdate();

	const form = useForm<TransactionSearchForm>({
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: transactionSearchFormDefaultValues
	});
	const { handleSubmit, getValues } = form;

	const onValueHasChanged = createOnValueHasChanged(
		handleSubmit,
		setPaginationState,
		forceUpdate
	);

	return (
		<PageResponsiveWrapper className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<TransactionSearchFilters
				form={form}
				onValueHasChanged={onValueHasChanged}
			/>
			<NeedsAttentionNotice />
			<TransactionTable
				filterValues={getValues()}
				pagination={paginationState}
				onPaginationChange={setPaginationState}
			/>
		</PageResponsiveWrapper>
	);
};
