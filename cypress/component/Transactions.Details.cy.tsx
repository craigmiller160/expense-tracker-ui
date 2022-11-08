import { mountApp } from './testutils/mountApp';
import { transactionsApi } from './testutils/apis/transactions';
import { allTransactions } from './testutils/constants/transactions';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionDetailsPage } from './testutils/pages/transactionDetails';
import { TransactionDetailsResponse } from '../../src/types/generated/expense-tracker';
import { categoriesApi } from './testutils/apis/categories';
import Chainable = Cypress.Chainable;

const testValidationRule = (
	input: Chainable<JQuery>,
	getHelperText: () => Chainable<JQuery>,
	errorMessage: string,
	updatedValue: string
) => {
	input.clear();
	transactionDetailsPage.getSaveButton().should('be.disabled');
	getHelperText().contains(errorMessage);

	input.type(updatedValue);
	getHelperText().should('not.exist');
	transactionDetailsPage.getSaveButton().should('not.be.disabled');
};

describe('Transaction Details Dialog', () => {
	it('input field validation rules work', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();
		testValidationRule(
			transactionDetailsPage.getAmountInput(),
			transactionDetailsPage.getAmountInputHelperText,
			'Amount is required',
			'-10.00'
		);
		// TODO finish this
	});

	it('can confirm transaction', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
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
							amount: fixture.amount,
							expenseDate: fixture.expenseDate,
							description: fixture.description,
							transactionId,
							confirmed: true
						});
					})
		);
	});
});
