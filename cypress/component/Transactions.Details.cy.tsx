import { mountApp } from './testutils/mountApp';
import { transactionsApi } from './testutils/apis/transactions';
import {
	allTransactions,
	transactionDetails
} from './testutils/constants/transactions';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionDetailsPage } from './testutils/pages/transactionDetails';
import { TransactionDetailsResponse } from '../../src/types/generated/expense-tracker';
import { categoriesApi } from './testutils/apis/categories';
import Chainable = Cypress.Chainable;
import {
	serverDateTimeToDisplayDateTime,
	serverDateToDisplayDate
} from '../../src/utils/dateTimeUtils';

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
	it('adds a new transaction', () => {
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getAddTransactionButton().click();
		transactionDetailsPage.getHeaderTitle().contains('Transaction Details');
		transactionDetailsPage.getNotConfirmedIcon().should('exist');
		transactionDetailsPage.getNotCategorizedIcon().should('exist');
		transactionDetailsPage.getDuplicateIcon().should('not.be.visible');
		transactionDetailsPage.getPossibleRefundIcon().should('not.be.visible');
		transactionDetailsPage.getSaveButton().should('be.disabled');
		transactionDetailsPage.getDeleteButton().should('not.exist');
		transactionDetailsPage.getCreatedTimestamp().should('not.exist');
		transactionDetailsPage.getUpdatedTimestamp().should('not.exist');

		transactionDetailsPage.getExpenseDateInput().type('01/01/2022');
		transactionDetailsPage.getAmountInput().clear().type('-10.00');
		transactionDetailsPage.getDescriptionInput().type('Hello World');
		transactionDetailsPage
			.getSaveButton()
			.should('not.be.disabled')
			.click();

		cy.wait('@createTransaction').then((xhr) => {
			expect(xhr.request.body).to.eql({
				amount: -10,
				description: 'Hello World',
				expenseDate: '2022-01-01'
			});
		});
	});

	it('shows current transaction information for unconfirmed and uncategorized', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();
		transactionDetailsPage
			.getExpenseDateInput()
			.should(
				'have.value',
				serverDateToDisplayDate(transactionDetails.expenseDate)
			);
		transactionDetailsPage
			.getAmountInput()
			.should('have.value', transactionDetails.amount);
		transactionDetailsPage
			.getDescriptionInput()
			.should('have.value', transactionDetails.description);

		transactionDetailsPage
			.getCreatedTimestamp()
			.contains(
				`Created: ${serverDateTimeToDisplayDateTime(
					transactionDetails.created
				)}`
			);
		transactionDetailsPage
			.getUpdatedTimestamp()
			.contains(
				`Updated: ${serverDateTimeToDisplayDateTime(
					transactionDetails.updated
				)}`
			);

		transactionDetailsPage.getDuplicateTitle().should('not.exist');
		transactionDetailsPage.getSaveButton().should('be.disabled');
		transactionDetailsPage.getDeleteButton().should('not.be.disabled');
	});

	it('shows current transaction information for confirmed and categorized', () => {
		// TODO include timestamps
		throw new Error();
	});

	it('shows current transaction information for possible refunds', () => {
		// TODO include timestamps
		throw new Error();
	});

	it('shows current transaction information for duplicates', () => {
		// TODO include timestamps
		// TODO include one duplicate with a category and one without
		throw new Error();
	});

	it('can update transaction information', () => {
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
		transactionDetailsPage.getDeleteButton().should('be.visible');
		transactionDetailsPage.getExpenseDateInput().clear().type('01/01/2022');
		transactionDetailsPage.getAmountInput().clear().type('-10.00');
		transactionDetailsPage
			.getDescriptionInput()
			.clear()
			.type('Hello World');
		transactionDetailsPage.getSaveButton().click();
		transactionDetailsPage.getHeaderTitle().should('not.be.visible');

		cy.wait(`@updateTransactionDetails_${transactionId}`).then((xhr) => {
			expect(xhr.request.body).to.eql({
				amount: -10,
				expenseDate: '2022-01-01',
				description: 'Hello World',
				transactionId,
				confirmed: false
			});
		});
	});

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
			transactionDetailsPage.getExpenseDateInput(),
			transactionDetailsPage.getExpenseDateInputHelperText,
			'Expense Date is required',
			'01/01/2022'
		);
		testValidationRule(
			transactionDetailsPage.getAmountInput(),
			transactionDetailsPage.getAmountInputHelperText,
			'Amount is required',
			'-10.00'
		);
		testValidationRule(
			transactionDetailsPage.getDescriptionInput(),
			transactionDetailsPage.getDescriptionHelperText,
			'Description is required',
			'Hello World'
		);
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

	it('can navigate to a duplicate transaction', () => {
		throw new Error();
	});
});
