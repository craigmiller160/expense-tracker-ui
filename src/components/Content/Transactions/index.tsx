import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import type { Updater } from 'use-immer';
import type { TransactionSearchForm } from './utils';
import { DEFAULT_ROWS_PER_PAGE } from './utils';
import { TransactionSearchFilters } from './TransactionSearchFilters';
import type { UseFormHandleSubmit } from 'react-hook-form';
import { NeedsAttentionNotice } from './NeedsAttentionNotice';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';
import { useTransactionDetailsDialogActions } from './useTransactionDetailsDialogActions';
import type { PaginationState } from '../../../utils/pagination';
import { useSetupFilterForm } from './useSetupFilterForm';
import type { StateFromParams } from '../../../routes/useImmerWithSearchParamSync';
import { useImmerWithSearchParamSync } from '../../../routes/useImmerWithSearchParamSync';
import type { SyncToParams } from '../../../routes/useSearchParamSync';
import { TransactionTableWrapper } from './TransactionTableWrapper';

const createOnValueHasChanged = (
	handleSubmit: UseFormHandleSubmit<TransactionSearchForm>,
	setPaginationState: Updater<PaginationState>
) =>
	handleSubmit(() =>
		setPaginationState((draft) => {
			if (draft.pageNumber !== 0) {
				draft.pageNumber = 0;
			}
		})
	);

const stateToParams: SyncToParams<PaginationState> = (state, params) => {
	params.setOrDelete('pageNumber', state.pageNumber.toString());
	params.setOrDelete('pageSize', state.pageSize.toString());
};
const stateFromParams: StateFromParams<PaginationState> = (draft, params) => {
	draft.pageNumber = params.getOrDefault('pageNumber', 0, parseInt);
	draft.pageSize = params.getOrDefault(
		'pageSize',
		DEFAULT_ROWS_PER_PAGE,
		parseInt
	);
};

export const Transactions = () => {
	const [paginationState, setPaginationState] =
		useImmerWithSearchParamSync<PaginationState>({
			initialState: {
				pageNumber: 0,
				pageSize: DEFAULT_ROWS_PER_PAGE
			},
			stateToParams,
			stateFromParams
		});
	const form = useSetupFilterForm();

	const { handleSubmit, getValues } = form;

	const onValueHasChanged = createOnValueHasChanged(
		handleSubmit,
		setPaginationState
	);

	const {
		selectedTransactionId,
		openDetailsDialog,
		closeDetailsDialog,
		saveTransaction,
		deleteTransaction,
		dialogIsOpen
	} = useTransactionDetailsDialogActions();

	return (
		<PageResponsiveWrapper className="manage-transactions">
			<PageTitle title="Manage Transactions" />
			<TransactionSearchFilters
				form={form}
				onValueHasChanged={onValueHasChanged}
			/>
			<NeedsAttentionNotice />
			<TransactionTableWrapper
				filterValues={getValues()}
				pagination={paginationState}
				onPaginationChange={setPaginationState}
				openDetailsDialog={openDetailsDialog}
			/>
			<TransactionDetailsDialog
				open={dialogIsOpen}
				selectedTransactionId={selectedTransactionId}
				updateSelectedTransactionId={openDetailsDialog}
				onClose={closeDetailsDialog}
				saveTransaction={saveTransaction}
				deleteTransaction={deleteTransaction}
			/>
		</PageResponsiveWrapper>
	);
};
