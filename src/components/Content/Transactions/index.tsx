import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import { Updater, useImmer } from 'use-immer';
import {
	DEFAULT_ROWS_PER_PAGE,
	TransactionSearchForm,
	transactionSearchFormDefaultValues
} from './utils';
import { TransactionTable } from './TransactionTable';
import { TransactionSearchFilters } from './TransactionSearchFilters';
import { UseFormHandleSubmit, UseFormReturn } from 'react-hook-form';
import { ForceUpdate, useForceUpdate } from '../../../utils/useForceUpdate';
import { NeedsAttentionNotice } from './NeedsAttentionNotice';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';
import { useTransactionDetailsDialogActions } from './useTransactionDetailsDialogActions';
import { PaginationState } from '../../../utils/pagination';
import { useFormWithSearchParamSync } from '../../../routes/useFormWithSearchParamSync';
import {
	SyncFromParams,
	SyncToParams
} from '../../../routes/useSearchParamSync';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';
import { CategoryOption } from '../../../types/categories';

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

const formToParams: SyncToParams<TransactionSearchForm> = (form) => {
	const params = new URLSearchParams();
	// TODO finish this
	return params;
};

const formFromParams =
	(
		categories: ReadonlyArray<CategoryOption>
	): SyncFromParams<TransactionSearchForm> =>
	(params) => {
		// TODO finish this
		throw new Error();
	};

const useSetupForm = (): UseFormReturn<TransactionSearchForm> => {
	const { data } = useGetAllCategories();
	const categories = useCategoriesToCategoryOptions(data);
	return useFormWithSearchParamSync<TransactionSearchForm>({
		formToParams,
		formFromParams: formFromParams(categories),
		formFromParamsDependencies: [categories],
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: transactionSearchFormDefaultValues
	});
};

export const Transactions = () => {
	const [paginationState, setPaginationState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const forceUpdate = useForceUpdate();
	const form = useSetupForm();

	const { handleSubmit, getValues } = form;

	const onValueHasChanged = createOnValueHasChanged(
		handleSubmit,
		setPaginationState,
		forceUpdate
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
