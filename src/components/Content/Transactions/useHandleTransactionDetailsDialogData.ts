import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { transactionToCategoryOption } from './utils';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import {
	parseDisplayDate,
	serverDateTimeToDisplayDateTime,
	serverDateToDisplayDate
} from '../../../utils/dateTimeUtils';
import { useGetTransactionDetails } from '../../../ajaxapi/query/TransactionQueries';
import { CategoryOption } from '../../../types/categories';

export type TransactionDetailsFormData = {
	readonly confirmed: boolean;
	readonly category: CategoryOption | null;
	readonly expenseDate: Date;
	readonly description: string;
	readonly amount: string;
};

export type TransactionValues = {
	readonly id: string;
	readonly confirmed: boolean;
	readonly duplicate: boolean;
	readonly category: CategoryOption | null;
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly isLoading: boolean;
	readonly created: string;
	readonly updated: string;
};

export type TransactionDetailsDialogData = {
	readonly transactionValues: TransactionValues;
	readonly form: UseFormReturn<TransactionDetailsFormData>;
};

const DEFAULT_TXN_VALUES: TransactionValues = {
	id: '',
	confirmed: true,
	duplicate: false,
	category: null,
	expenseDate: '',
	description: '',
	amount: 0,
	isLoading: false,
	created: '',
	updated: ''
};

const useValuesFromSelectedTransaction = (
	selectedTransactionId: OptionT<string>
): TransactionValues => {
	const { data, isLoading } = useGetTransactionDetails(selectedTransactionId);
	return useMemo(
		() =>
			pipe(
				Option.fromNullable(data),
				Option.fold(
					() => ({
						...DEFAULT_TXN_VALUES,
						isLoading
					}),
					(txn) => ({
						...txn,
						isLoading,
						expenseDate: serverDateToDisplayDate(txn.expenseDate),
						category: transactionToCategoryOption(txn),
						created: serverDateTimeToDisplayDateTime(txn.created),
						updated: serverDateTimeToDisplayDateTime(txn.updated)
					})
				)
			),
		[data, isLoading]
	);
};

export const useHandleTransactionDetailsDialogData = (
	selectedTransactionId: OptionT<string>,
	open: boolean
): TransactionDetailsDialogData => {
	const transactionValues = useValuesFromSelectedTransaction(
		selectedTransactionId
	);

	const form = useForm<TransactionDetailsFormData>({
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = form;

	useEffect(() => {
		reset({
			confirmed: transactionValues.confirmed,
			category: transactionValues.category,
			description: transactionValues.description,
			amount: transactionValues.amount.toFixed(2),
			expenseDate: parseDisplayDate(transactionValues.expenseDate)
		});
	}, [transactionValues, reset, open]);

	return {
		transactionValues,
		form
	};
};
