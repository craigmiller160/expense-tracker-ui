import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/es6/Option';

interface TransactionDetailsDialogState {
	readonly selectedTransaction: OptionT<TransactionResponse>;
}

interface TransactionDetailsDialogActions {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly closeDetailsDialog: () => void;
	readonly saveTransaction: (transaction: TransactionResponse) => void;
	readonly deleteTransaction: (id: string) => void;
}

export const useTransactionDetailsDialogActions =
	(): TransactionDetailsDialogActions => {
		const [detailsDialogState, setDetailsDialogState] =
			useImmer<TransactionDetailsDialogState>({
				selectedTransaction: Option.none
			});

		const closeDetailsDialog = () =>
			setDetailsDialogState((draft) => {
				draft.selectedTransaction = Option.none;
			});

		const saveTransaction = () => {};
		const deleteTransaction = () => {};

		return {
			selectedTransaction: detailsDialogState.selectedTransaction,
			closeDetailsDialog,
			saveTransaction,
			deleteTransaction
		};
	};
