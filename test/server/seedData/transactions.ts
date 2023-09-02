import { DataUpdater } from '../Database';
import { TransactionDetailsResponse } from '../../../src/types/generated/expense-tracker';
import * as Time from '@craigmiller160/ts-functions/Time';
import { pipe } from 'fp-ts/function';
import * as RNonEmptyArray from 'fp-ts/ReadonlyNonEmptyArray';
import * as Monoid from 'fp-ts/Monoid';
import {
	createTransaction,
	transactionRecordMonoid,
	transactionToRecord
} from '../../testutils/transactionDataUtils';
import { formatServerDate } from '../../../src/utils/dateTimeUtils';

const newExpenseDate = (index: number): string =>
	pipe(new Date(), Time.subDays(index), formatServerDate);

const createTransactionFromIndex = (
	index: number
): TransactionDetailsResponse =>
	createTransaction({
		expenseDate: newExpenseDate(index),
		amount: (10 + index) * -1,
		confirmed: false,
		duplicate: false,
		index
	});

export const seedTransactions: DataUpdater = (draft) => {
	draft.transactions = pipe(
		RNonEmptyArray.range(0, 99),
		RNonEmptyArray.map(createTransactionFromIndex),
		RNonEmptyArray.map(transactionToRecord),
		Monoid.concatAll(transactionRecordMonoid)
	);
};
