import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import { nanoid } from 'nanoid';
import { pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { formatServerDateTime } from '../../src/utils/dateTimeUtils';
import {
	TransactionResponse,
	TransactionDetailsResponse
} from '../../src/types/generated/expense-tracker';

export const transactionRecordMonoid: MonoidT<
	Record<string, TransactionDetailsResponse>
> = {
	empty: {},
	concat: (db1, db2) => ({
		...db1,
		...db2
	})
};

export const transactionToRecord = (
	transaction: TransactionDetailsResponse
): Record<string, TransactionDetailsResponse> => ({
	[transaction.id]: transaction
});

export type TestTransactionDescription = Omit<
	TransactionResponse,
	'id' | 'description'
> & {
	readonly index: number;
};

const createDate = (index: number): string =>
	pipe(new Date(), Time.subDays(index), formatServerDateTime);

export const createTransaction = (
	transaction: TestTransactionDescription
): TransactionDetailsResponse => ({
	...transaction,
	id: nanoid(),
	description: JSON.stringify({
		...transaction,
		id: undefined,
		description: undefined
	}),
	created: createDate(transaction.index),
	updated: createDate(transaction.index)
});
