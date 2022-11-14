import { categoriesApi } from './testutils/apis/categories';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { commonPage } from './testutils/pages/common';
import { orderedCategoryNames } from './testutils/constants/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';

describe('Transactions Table', () => {
	it('can reset in-progress changes on transactions', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
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
		commonPage.getOpenSelectOptions().eq(0).click();
		transactionsListPage
			.getCategorySelects()
			.eq(0)
			.should('have.value', orderedCategoryNames[0]);

		transactionsListPage.getResetButton().should('not.be.disabled').click();
		transactionsListPage
			.getConfirmCheckboxes()
			.eq(0)
			.should('have.value', 'false');
		transactionsListPage
			.getCategorySelects()
			.eq(0)
			.should('have.value', '');
	});
});
