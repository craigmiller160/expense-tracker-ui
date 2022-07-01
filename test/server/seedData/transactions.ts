import { DataUpdater } from '../Database';
import {
	DATE_FORMAT,
	TransactionResponse
} from '../../../src/types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import { nanoid } from 'nanoid';

const newExpenseDate = (index: number): string =>
	pipe(new Date(), Time.addDays(index), Time.format(DATE_FORMAT));

const createTransaction = (index: number): TransactionResponse => ({
	id: nanoid(),
	expenseDate: newExpenseDate(index),
	description: `Transaction ${index}`,
	amount: 10 + index,
	confirmed: false
});

export const seedTransactions: DataUpdater = (draft) => {
	draft.transactions = [...Array(100).keys()]
		.map((index) => createTransaction(index))
		.reduce((acc, txn) => {
			acc[txn.id] = txn;
			return acc;
		}, {} as Record<string, TransactionResponse>);
};
