import { DataUpdater } from '../Database';
import {
	DATE_FORMAT,
	TransactionResponse
} from '../../../src/types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import * as Monoid from 'fp-ts/es6/Monoid';
import { createTransaction } from '../createTransaction';
import {
	transactionRecordMonoid,
	transactionToRecord
} from '../../testutils/transactionDataUtils';

const newExpenseDate = (index: number): string =>
	pipe(new Date(), Time.subDays(index), Time.format(DATE_FORMAT));

const createTransactionFromIndex = (index: number): TransactionResponse =>
	createTransaction({
		expenseDate: newExpenseDate(index),
		amount: 10 + index,
		confirmed: false,
		duplicate: false
	});

export const seedTransactions: DataUpdater = (draft) => {
	draft.transactions = pipe(
		RNonEmptyArray.range(0, 99),
		RNonEmptyArray.map(createTransactionFromIndex),
		RNonEmptyArray.map(transactionToRecord),
		Monoid.concatAll(transactionRecordMonoid)
	);
};
