import { categoriesApi } from './testutils/apis/categories';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';

describe('Transactions Table', () => {
	it('can reset in-progress changes on transactions', () => {
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});
		throw new Error();
	});
});
