import { categoriesApi } from './testutils/apis/categories';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { commonPage } from './testutils/pages/common';
import { orderedCategoryNames } from './testutils/constants/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { confirmDialogPage } from './testutils/pages/confirmDialog';
import { alertPage } from './testutils/pages/alert';

describe('Transactions Table', () => {
	it('can delete all unconfirmed transactions', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
		});

		transactionsListPage
			.getDeleteAllUnconfirmedTransactionsButton()
			.should('have.text', 'Delete All Unconfirmed Transactions');

		transactionsListPage
			.getDeleteAllUnconfirmedTransactionsButton()
			.click();

		confirmDialogPage
			.getTitle()
			.should('have.text', 'Delete All Unconfirmed Transactions');
		confirmDialogPage
			.getMessage()
			.should(
				'have.text',
				'This will delete all unconfirmed transactions regardless of filter settings. Are you sure you want to proceed?'
			);

		transactionsApi.deleteAllUnconfirmed();
		confirmDialogPage.getConfirmButton().click();
		cy.wait('@deleteAllUnconfirmed');

		alertPage
			.getAlertMessage()
			.should('have.length', 1)
			.should(
				'have.text',
				'Successfully deleted 5 unconfirmed transactions'
			);
	});

	it('can select a category on a record which is then auto-confirmed', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
		});

		transactionsListPage
			.getConfirmCheckboxes()
			.eq(0)
			.should('not.be.checked');

		transactionsListPage.getCategorySelects().eq(0).click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
		transactionsListPage
			.getCategorySelects()
			.eq(0)
			.should('have.value', orderedCategoryNames[0]);

		transactionsListPage.getConfirmCheckboxes().eq(0).should('be.checked');
	});

	it('can reset in-progress changes on transactions', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
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
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
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
