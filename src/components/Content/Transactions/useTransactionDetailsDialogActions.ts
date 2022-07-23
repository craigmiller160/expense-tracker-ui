import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { useImmer } from 'use-immer';
import * as Option from 'fp-ts/es6/Option';

interface TransactionDetailsDialogState {
	readonly selectedTransaction: OptionT<TransactionResponse>;
}

interface TransactionDetailsDialogActions {
	readonly selectedTransaction: OptionT<TransactionResponse>;
}

export const useTransactionDetailsDialogActions =
	(): TransactionDetailsDialogActions => {
		const [detailsDialogState, setDetailsDialogState] =
			useImmer<TransactionDetailsDialogState>({
				selectedTransaction: Option.none
			});

		return {
			selectedTransaction: detailsDialogState.selectedTransaction
		};
	};
