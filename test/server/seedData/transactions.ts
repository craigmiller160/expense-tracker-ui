import { DataUpdater } from '../Database';
import {
	DATE_FORMAT,
	TransactionResponse
} from '../../../src/types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import { nanoid } from 'nanoid';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import * as Monoid from 'fp-ts/es6/Monoid';

const newExpenseDate = (index: number): string =>
	pipe(new Date(), Time.addDays(index), Time.format(DATE_FORMAT));

const createTransaction = (index: number): TransactionResponse => ({
	id: nanoid(),
	expenseDate: newExpenseDate(index),
	description: `Transaction ${index}`,
	amount: 10 + index,
	confirmed: false,
	duplicate: false
});

const transactionDbMonoid: MonoidT<Record<string, TransactionResponse>> = {
	empty: {},
	concat: (db1, db2) => ({
		...db1,
		...db2
	})
};

export const seedTransactions: DataUpdater = (draft) => {
	draft.transactions = pipe(
		RNonEmptyArray.range(0, 99),
		RNonEmptyArray.map(createTransaction),
		RNonEmptyArray.map(
			(txn): Record<string, TransactionResponse> => ({ [txn.id]: txn })
		),
		Monoid.concatAll(transactionDbMonoid)
	);
	const transactions = Object.values(draft.transactions);
	const categories = Object.values(draft.categories);
	draft.transactions[transactions[0].id] = {
		...transactions[0],
		confirmed: true,
		categoryId: draft.categories[categories[0].id].id,
		categoryName: draft.categories[categories[0].id].name
	};
	draft.transactions[transactions[0].id] = {
		...transactions[0],
		duplicate: true
	};
};
