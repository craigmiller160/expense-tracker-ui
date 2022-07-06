import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../src/types/transactions';
import { nanoid } from 'nanoid';

export const transactionRecordMonoid: MonoidT<
	Record<string, TransactionResponse>
> = {
	empty: {},
	concat: (db1, db2) => ({
		...db1,
		...db2
	})
};

export const transactionToRecord = (
	transaction: TransactionResponse
): Record<string, TransactionResponse> => ({ [transaction.id]: transaction });

export type TestTransactionDescription = Omit<
	TransactionResponse,
	'id' | 'description'
>;

export const createTransaction = (
	transaction: TestTransactionDescription
): TransactionResponse => ({
	...transaction,
	id: nanoid(),
	description: JSON.stringify({
		...transaction,
		id: undefined,
		description: undefined
	})
});
