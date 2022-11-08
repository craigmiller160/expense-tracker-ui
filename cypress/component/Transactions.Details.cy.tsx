import { mountApp } from './testutils/mountApp';
import { transactionsApi } from './testutils/apis/transactions';
import { allTransactions } from './testutils/constants/transactions';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionDetailsPage } from './testutils/pages/transactionDetails';
import { TransactionDetailsResponse } from '../../src/types/generated/expense-tracker';
import { categoriesApi } from './testutils/apis/categories';

describe('Transaction Details Dialog', () => {
	it('input field validation rules work', () => {
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});
		throw new Error();
	});

	it('can confirm transaction', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		transactionsApi.updateTransactionDetails(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();
		transactionDetailsPage.getSaveButton().should('be.disabled');
		transactionDetailsPage
			.getConfirmCheckboxInput()
			.should('not.be.checked')
			.click()
			.should('be.checked');
		transactionDetailsPage
			.getSaveButton()
			.should('not.be.disabled')
			.click();

		cy.fixture('transactionDetails.json').then(
			(fixture: TransactionDetailsResponse) =>
				cy
					.wait(`@updateTransactionDetails_${transactionId}`)
					.then((xhr) => {
						expect(xhr.request.body).to.eql({
							...fixture,
							id: transactionId,
							confirmed: true
						});
					})
		);
	});
});
