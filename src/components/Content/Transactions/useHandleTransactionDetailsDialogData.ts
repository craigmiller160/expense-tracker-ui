import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { CategoryOption, transactionToCategoryOption } from './utils';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo } from 'react';

export type TransactionDetailsFormData = {
	readonly confirmed: boolean;
	readonly category: CategoryOption | null;
};

export type TransactionValues = {
	readonly id: string | null;
	readonly confirmed: boolean;
	readonly duplicate: boolean;
	readonly category: CategoryOption | null;
	readonly expenseDate: string | null;
	readonly description: string | null;
	readonly amount: number;
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
						confirmed: transaction.confirmed,
						duplicate: transaction.duplicate,
						category: transactionToCategoryOption(transaction),
						expenseDate: transaction.expenseDate,
						description: transaction.description,
						amount: transaction.amount
					})
				),
				Option.getOrElse(
					(): TransactionValues => ({
						id: null,
						confirmed: false,
						duplicate: false,
						category: null,
						expenseDate: null,
						description: null,
						amount: 0
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
			confirmed: transactionValues.confirmed,
			category: transactionValues.category
		}
	});

	const { reset } = form;

	useEffect(() => {
		reset({
			confirmed: transactionValues.confirmed,
			category: transactionValues.category
		});
	}, [transactionValues, reset]);

	return {
		transactionValues,
		form
	};
};
