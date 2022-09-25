import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { CategoryOption, transactionToCategoryOption } from './utils';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';

export type TransactionDetailsFormData = {
	readonly isConfirmed: boolean;
	readonly category: CategoryOption | null;
};

export type TransactionValues = {
	readonly id: string | null;
	readonly isConfirmed: boolean;
	readonly isDuplicate: boolean;
	readonly category: CategoryOption | null;
};

export type TransactionDetailsDialogData = {
	readonly transactionValues: TransactionValues;
	readonly form: UseFormReturn<TransactionDetailsFormData>;
};

const useValuesFromSelectedTransaction = (
	selectedTransaction: OptionT<TransactionResponse>
): TransactionValues =>
	pipe(
		selectedTransaction,
		Option.map(
			(transaction): TransactionValues => ({
				id: transaction.id,
				isConfirmed: transaction.confirmed,
				isDuplicate: transaction.duplicate,
				category: transactionToCategoryOption(transaction)
			})
		),
		Option.getOrElse(
			(): TransactionValues => ({
				id: null,
				isConfirmed: false,
				isDuplicate: false,
				category: null
			})
		)
	);

export const useHandleTransactionDetailsDialogData = (
	selectedTransaction: OptionT<TransactionResponse>
): TransactionDetailsDialogData => {
	const transactionValues =
		useValuesFromSelectedTransaction(selectedTransaction);

	const form = useForm<TransactionDetailsFormData>({
		defaultValues: {
			isConfirmed: transactionValues.isConfirmed,
			category: transactionValues.category
		}
	});

	useEffect(() => {
		form.reset({
			isConfirmed: transactionValues.isConfirmed,
			category: transactionValues.category
		});
	}, [transactionValues.id, form.reset()]);

	return {
		transactionValues,
		form
	};
};
