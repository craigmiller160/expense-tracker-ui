import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { CategoryOption, transactionToCategoryOption } from './utils';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';

export type TransactionDetailsFormData = {
	readonly isConfirmed: boolean;
	readonly category: CategoryOption | null;
};

export type TransactionValues = {
	readonly id: string | null;
	readonly isConfirmed: boolean;
	readonly isDuplicate: boolean;
	readonly category: CategoryOption | null;
	readonly expenseDate: string | null;
	readonly description: string | null;
	readonly amount: string | null;
};

export type TransactionDetailsDialogData = {
	readonly transactionValues: TransactionValues;
	readonly form: UseFormReturn<TransactionDetailsFormData>;
};

const useValuesFromSelectedTransaction = (
	selectedTransaction: OptionT<TransactionResponse>
): TransactionValues => {
	// Doing this separately to help with dependency arrays
	const transactionId: string | null = pipe(
		selectedTransaction,
		Option.map((txn): string | null => txn.id),
		Option.getOrElse((): string | null => null)
	);
	return useMemo(
		() =>
			pipe(
				selectedTransaction,
				Option.map(
					(transaction): TransactionValues => ({
						id: transaction.id,
						isConfirmed: transaction.confirmed,
						isDuplicate: transaction.duplicate,
						category: transactionToCategoryOption(transaction),
						// TODO do I format the date in the table?
						expenseDate: transaction.expenseDate,
						description: transaction.description,
						amount: formatCurrency(transaction.amount)
					})
				),
				Option.getOrElse(
					(): TransactionValues => ({
						id: null,
						isConfirmed: false,
						isDuplicate: false,
						category: null,
						expenseDate: null,
						description: null,
						amount: null
					})
				)
			),
		[transactionId] // eslint-disable-line react-hooks/exhaustive-deps
	);
};

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

	const { reset } = form;

	useEffect(() => {
		reset({
			isConfirmed: transactionValues.isConfirmed,
			category: transactionValues.category
		});
	}, [transactionValues, reset]);

	return {
		transactionValues,
		form
	};
};