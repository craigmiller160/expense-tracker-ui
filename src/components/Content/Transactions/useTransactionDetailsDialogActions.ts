import { OptionT } from '@craigmiller160/ts-functions/es/types';
import {
	TransactionResponse,
	TransactionToUpdate
} from '../../../types/transactions';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/es6/Option';
import {
	useDeleteTransactions,
	useUpdateTransactions
} from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import { useContext } from 'react';
import { ConfirmDialogContext } from '../../UI/ConfirmDialog/ConfirmDialogProvider';

interface TransactionDetailsDialogState {
	readonly selectedTransaction: OptionT<TransactionResponse>;
}

interface TransactionDetailsDialogActions {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly openDetailsDialog: (transaction: TransactionResponse) => void;
	readonly closeDetailsDialog: () => void;
	readonly saveTransaction: (transaction: TransactionToUpdate) => void;
	readonly deleteTransaction: (id: string | null) => void;
}

export const useTransactionDetailsDialogActions =
	(): TransactionDetailsDialogActions => {
		const { newConfirmDialog } = useContext(ConfirmDialogContext);
		const [detailsDialogState, setDetailsDialogState] =
			useImmer<TransactionDetailsDialogState>({
				selectedTransaction: Option.none
			});
		const { mutate: updateTransactionsMutate } = useUpdateTransactions();
		const { mutate: deleteTransactionsMutate } = useDeleteTransactions();

		const openDetailsDialog = (transaction: TransactionResponse) =>
			setDetailsDialogState((draft) => {
				draft.selectedTransaction = Option.of(transaction);
			});

		const closeDetailsDialog = () =>
			setDetailsDialogState((draft) => {
				draft.selectedTransaction = Option.none;
			});

		const saveTransaction = (transaction: TransactionToUpdate) => {
			closeDetailsDialog();
			updateTransactionsMutate({
				transactions: [transaction]
			});
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
			selectedTransaction: detailsDialogState.selectedTransaction,
			openDetailsDialog,
			closeDetailsDialog,
			saveTransaction,
			deleteTransaction
		};
	};
