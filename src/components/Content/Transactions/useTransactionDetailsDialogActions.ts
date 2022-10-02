import { OptionT } from '@craigmiller160/ts-functions/es/types';
import {
	TransactionResponse,
	UpdateTransactionDetailsRequest
} from '../../../types/transactions';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/es6/Option';
import {
	useDeleteTransactions,
	useUpdateTransactionDetails
} from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import { useContext } from 'react';
import { ConfirmDialogContext } from '../../UI/ConfirmDialog/ConfirmDialogProvider';

interface TransactionDetailsDialogState {
	readonly open: boolean;
	readonly selectedTransaction: OptionT<TransactionResponse>;
}

interface TransactionDetailsDialogActions {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly openDetailsDialog: (transaction: TransactionResponse) => void;
	readonly closeDetailsDialog: () => void;
	readonly saveTransaction: (
		transaction: UpdateTransactionDetailsRequest
	) => void;
	readonly deleteTransaction: (id: string | null) => void;
	readonly dialogIsOpen: boolean;
}

export const useTransactionDetailsDialogActions =
	(): TransactionDetailsDialogActions => {
		const { newConfirmDialog } = useContext(ConfirmDialogContext);
		const [detailsDialogState, setDetailsDialogState] =
			useImmer<TransactionDetailsDialogState>({
				open: false,
				selectedTransaction: Option.none
			});
		const { mutate: updateTransactionsMutate } =
			useUpdateTransactionDetails();
		const { mutate: deleteTransactionsMutate } = useDeleteTransactions();

		const openDetailsDialog = (transaction: TransactionResponse) =>
			setDetailsDialogState((draft) => {
				draft.selectedTransaction = Option.of(transaction);
			});

		const closeDetailsDialog = () =>
			setDetailsDialogState((draft) => {
				draft.open = false;
				draft.selectedTransaction = Option.none;
			});

		const saveTransaction = (request: UpdateTransactionDetailsRequest) => {
			closeDetailsDialog();
			updateTransactionsMutate({
				request
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
			deleteTransaction,
			dialogIsOpen: detailsDialogState.open
		};
	};
