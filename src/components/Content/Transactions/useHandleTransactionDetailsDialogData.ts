import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { CategoryOption, transactionToCategoryOption } from './utils';
import { useForm, UseFormReset, UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const parseDate = Time.parse('yyyy-MM-dd');

export type TransactionDetailsFormData = {
	readonly confirmed: boolean;
	readonly category: CategoryOption | null;
	readonly amount: number;
	readonly description: string;
	readonly expenseDate: Date;
};

const createSetInitialFormValues =
	(reset: UseFormReset<TransactionDetailsFormData>) =>
	(transaction: OptionT<TransactionResponse>) => {
		pipe(
			transaction,
			Option.map((txn) => {
				reset({
					confirmed: txn.confirmed,
					category: transactionToCategoryOption(txn),
					description: txn.description,
					amount: txn.amount,
					expenseDate: parseDate(txn.expenseDate)
				});
			})
		);
	};

export const useHandleTransactionDetailsDialogData = (
	selectedTransaction: OptionT<TransactionResponse>
): UseFormReturn<TransactionDetailsFormData> => {
	const form = useForm<TransactionDetailsFormData>();

	const { reset } = form;
	const setInitialFormValues = useMemo(
		() => createSetInitialFormValues(reset),
		[reset]
	);

	useEffect(() => {
		console.log('Setting form values');
		setInitialFormValues(selectedTransaction);
	}, [selectedTransaction, setInitialFormValues]);

	return form;
};
