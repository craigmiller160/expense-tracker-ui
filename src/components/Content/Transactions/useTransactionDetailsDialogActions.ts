import { OptionT } from '@craigmiller160/ts-functions/es/types';
import {
	TransactionResponse,
	TransactionToUpdate
} from '../../../types/transactions';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/es6/Option';
import { useUpdateTransactions } from '../../../ajaxapi/query/TransactionQueries';

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
		const [detailsDialogState, setDetailsDialogState] =
			useImmer<TransactionDetailsDialogState>({
				selectedTransaction: Option.none
			});
		const { mutate } = useUpdateTransactions();

		const openDetailsDialog = (transaction: TransactionResponse) =>
			setDetailsDialogState((draft) => {
				draft.selectedTransaction = Option.of(transaction);
			});

		const closeDetailsDialog = () =>
			setDetailsDialogState((draft) => {
				draft.selectedTransaction = Option.none;
			});

		const saveTransaction = (transaction: TransactionToUpdate) =>
			mutate({
				transactions: [transaction]
			});
		const deleteTransaction = () => {};

		return {
			selectedTransaction: detailsDialogState.selectedTransaction,
			openDetailsDialog,
			closeDetailsDialog,
			saveTransaction,
			deleteTransaction
		};
	};
