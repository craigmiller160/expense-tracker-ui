import { mountApp } from './testutils/mountApp';
import { transactionsApi } from './testutils/apis/transactions';
import { allTransactions } from './testutils/constants/transactions';

describe('Transaction Details Dialog', () => {
	it('input field validation rules work', () => {
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});
		throw new Error();
	});

	it('can confirm transaction', () => {
		const transactionId = allTransactions[0].id;
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});
		// TODO finish this
	});
});
