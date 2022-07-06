import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../src/types/transactions';

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
