import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/es6/Option';
import {
	useCreateTransaction,
	useDeleteTransactions,
	useUpdateTransactionDetails
} from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/es6/function';
import { useContext } from 'react';
import { ConfirmDialogContext } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { TransactionDetailsFormData } from './useHandleTransactionDetailsDialogData';
import { formatServerDate } from '../../../utils/dateTimeUtils';
import { TransactionResponse } from '../../../types/generated/expense-tracker';

interface TransactionDetailsDialogState {
	readonly open: boolean;
	readonly selectedTransaction: OptionT<TransactionResponse>;
}

interface TransactionDetailsDialogActions {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly openDetailsDialog: (transaction?: TransactionResponse) => void;
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
				selectedTransaction: Option.none
			});
		const { mutate: updateTransactionsMutate } =
			useUpdateTransactionDetails();
		const { mutate: createTransactionMutate } = useCreateTransaction();
		const { mutate: deleteTransactionsMutate } = useDeleteTransactions();

		const openDetailsDialog = (transaction?: TransactionResponse) =>
			setDetailsDialogState((draft) => {
				draft.open = true;
				draft.selectedTransaction = Option.fromNullable(transaction);
			});

		const closeDetailsDialog = () =>
			setDetailsDialogState((draft) => {
				draft.open = false;
				draft.selectedTransaction = Option.none;
			});

		const saveTransaction = (data: TransactionDetailsFormData) => {
			closeDetailsDialog();
			pipe(
				detailsDialogState.selectedTransaction,
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
					(txn) =>
						updateTransactionsMutate({
							request: {
								transactionId: txn.id,
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
			selectedTransaction: detailsDialogState.selectedTransaction,
			openDetailsDialog,
			closeDetailsDialog,
			saveTransaction,
			deleteTransaction,
			dialogIsOpen: detailsDialogState.open
		};
	};
