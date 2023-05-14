import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { Updater, useImmer } from 'use-immer';
import { DEFAULT_ROWS_PER_PAGE, TransactionSearchForm } from './utils';
import { TransactionTable } from './TransactionTable';
import { TransactionSearchFilters } from './TransactionSearchFilters';
import { UseFormHandleSubmit } from 'react-hook-form';
import { NeedsAttentionNotice } from './NeedsAttentionNotice';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';
import { useTransactionDetailsDialogActions } from './useTransactionDetailsDialogActions';
import { PaginationState } from '../../../utils/pagination';
import { useSetupFilterForm } from './useSetupFilterForm';

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

export const Transactions = () => {
	const [paginationState, setPaginationState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
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
