import { types } from '@craigmiller160/ts-functions';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/Option';
import {
	useCreateTransaction,
	useDeleteTransactions,
	useUpdateTransactionDetails
} from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/function';
import { useContext } from 'react';
import { ConfirmDialogContext } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import type { TransactionDetailsFormData } from './useHandleTransactionDetailsDialogData';
import { formatServerDate } from '../../../utils/dateTimeUtils';

interface TransactionDetailsDialogState {
	readonly open: boolean;
	readonly selectedTransactionId: types.OptionT<string>;
}

interface TransactionDetailsDialogActions {
	readonly selectedTransactionId: types.OptionT<string>;
	readonly openDetailsDialog: (transactionId?: string) => void;
	readonly closeDetailsDialog: () => void;
	readonly saveTransaction: (transaction: TransactionDetailsFormData) => void;
	readonly deleteTransaction: (id: string | null) => void;
	readonly dialogIsOpen: boolean;
}

export const useTransactionDetailsDialogActions =
	(): TransactionDetailsDialogActions => {
		const { newConfirmDialog } = useContext(ConfirmDialogContext);
		const [detailsDialogState, setDetailsDialogState] =
			useImmer<TransactionDetailsDialogState>({
				open: false,
				selectedTransactionId: Option.none
			});
		const { mutate: updateTransactionsMutate } =
			useUpdateTransactionDetails();
		const { mutate: createTransactionMutate } = useCreateTransaction();
		const { mutate: deleteTransactionsMutate } = useDeleteTransactions();

		const openDetailsDialog = (transactionId?: string) =>
			setDetailsDialogState((draft) => {
				draft.open = true;
				draft.selectedTransactionId =
					Option.fromNullable(transactionId);
			});

		const closeDetailsDialog = () =>
			setDetailsDialogState((draft) => {
				draft.open = false;
				draft.selectedTransactionId = Option.none;
			});

		const saveTransaction = (data: TransactionDetailsFormData) => {
			closeDetailsDialog();
			pipe(
				detailsDialogState.selectedTransactionId,
				Option.fold(
					() =>
						createTransactionMutate({
							request: {
								amount: parseFloat(data.amount),
								expenseDate: formatServerDate(data.expenseDate),
								categoryId: data.category?.value,
								description: data.description
							}
						}),
					(txnId) =>
						updateTransactionsMutate({
							request: {
								transactionId: txnId,
								amount: parseFloat(data.amount),
								confirmed: data.confirmed,
								expenseDate: formatServerDate(data.expenseDate),
								categoryId: data.category?.value,
								description: data.description
							}
						})
				)
			);
		};
		const deleteTransaction = (nullableId: string | null) => {
			const idsToDelete = pipe(
				Option.fromNullable(nullableId),
				Option.fold(
					() => [],
					(id) => [id]
				)
			);
			newConfirmDialog(
				'Delete Transaction',
				'Are you sure you want to delete this transaction?',
				() => {
					closeDetailsDialog();
					deleteTransactionsMutate({
						idsToDelete
					});
				}
			);
		};

		return {
			selectedTransactionId: detailsDialogState.selectedTransactionId,
			openDetailsDialog,
			closeDetailsDialog,
			saveTransaction,
			deleteTransaction,
			dialogIsOpen: detailsDialogState.open
		};
	};
