import { categoriesApi } from './testutils/apis/categories';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';
import { transactionsListPage } from './testutils/pages/transactionsList';

describe('Transactions Table', () => {
	it('can reset in-progress changes on transactions', () => {
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage
			.getConfirmCheckboxes()
			.eq(0)
			.should('have.value', 'false')
			.click()
			.should('have.value', 'true');
		transactionsListPage
			.getCategorySelects()
			.eq(0)
			.should('have.value', '')
			.click();
	});
});
