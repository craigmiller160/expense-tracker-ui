import { TransactionResponse } from '../../src/types/transactions';
import { nanoid } from 'nanoid';

export const createTransaction = (
	transaction: Omit<TransactionResponse, 'id' | 'description'>
): TransactionResponse => ({
	...transaction,
	id: nanoid(),
	description: JSON.stringify(transaction)
});
