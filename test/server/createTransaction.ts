import { TransactionResponse } from '../../src/types/transactions';
import { nanoid } from 'nanoid';

export type TestTransactionDescription = Omit<
	TransactionResponse,
	'id' | 'description'
>;

export const createTransaction = (
	transaction: TestTransactionDescription
): TransactionResponse => ({
	...transaction,
	id: nanoid(),
	description: JSON.stringify(transaction)
});
