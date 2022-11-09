import { mountApp } from './testutils/mountApp';
import { transactionsApi } from './testutils/apis/transactions';
import {
	allTransactions,
	possibleDuplicates,
	transactionDetails
} from './testutils/constants/transactions';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionDetailsPage } from './testutils/pages/transactionDetails';
import { TransactionDetailsResponse } from '../../src/types/generated/expense-tracker';
import { categoriesApi } from './testutils/apis/categories';
import {
	serverDateTimeToDisplayDateTime,
	serverDateToDisplayDate
} from '../../src/utils/dateTimeUtils';
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

const testDuplicate = (getRecord: () => Chainable<JQuery>, index: number) => {
	transactionDetailsPage
		.getCreatedTimestampForDuplicateRecord(getRecord())
		.contains(
			serverDateTimeToDisplayDateTime(
				possibleDuplicates.transactions[index].created
			)
		);
	transactionDetailsPage
		.getUpdatedTimestampForDuplicateRecord(getRecord())
		.contains(
			serverDateTimeToDisplayDateTime(
				possibleDuplicates.transactions[index].updated
			)
		);
	if (possibleDuplicates.transactions[index].categoryName) {
		transactionDetailsPage
			.getCategoryForDuplicateRecord(getRecord())
			.contains(possibleDuplicates.transactions[index].categoryName);
	} else {
		transactionDetailsPage
			.getCategoryForDuplicateRecord(getRecord())
			.then((elem) => expect(elem.text()).eq(''));
	}

	if (possibleDuplicates.transactions[index].confirmed) {
		transactionDetailsPage
			.getConfirmedForDuplicateRecord(getRecord())
			.contains('Yes');
	} else {
		transactionDetailsPage
			.getConfirmedForDuplicateRecord(getRecord())
			.contains('No');
	}

	transactionDetailsPage
		.getOpenButtonForDuplicateRecord(getRecord())
		.contains('Open');
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

		transactionDetailsPage
			.getNotConfirmedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getNotCategorizedIcon()
			.should('have.class', 'visible');
		transactionDetailsPage
			.getDuplicateIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getPossibleRefundIcon()
			.should('not.have.class', 'visible');

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
			.getNotCategorizedIcon()
			.should('have.class', 'visible');
		transactionDetailsPage
			.getNotConfirmedIcon()
			.should('have.class', 'visible');
		transactionDetailsPage
			.getPossibleRefundIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getDuplicateIcon()
			.should('not.have.class', 'visible');

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
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_confirmedAndCategorized(
			transactionId
		);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();

		transactionDetailsPage
			.getNotCategorizedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getNotConfirmedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getPossibleRefundIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getDuplicateIcon()
			.should('not.have.class', 'visible');

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

	it('shows current transaction information for possible refunds', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_possibleRefund(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();

		transactionDetailsPage
			.getNotCategorizedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getNotConfirmedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getPossibleRefundIcon()
			.should('have.class', 'visible');
		transactionDetailsPage
			.getDuplicateIcon()
			.should('not.have.class', 'visible');

		transactionDetailsPage
			.getExpenseDateInput()
			.should(
				'have.value',
				serverDateToDisplayDate(transactionDetails.expenseDate)
			);
		transactionDetailsPage.getAmountInput().should('have.value', '10.00');
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

	it('shows current transaction information for duplicates', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_duplicate(transactionId);
		transactionsApi.getPossibleDuplicates(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();

		transactionDetailsPage
			.getNotCategorizedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getNotConfirmedIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getPossibleRefundIcon()
			.should('not.have.class', 'visible');
		transactionDetailsPage
			.getDuplicateIcon()
			.should('have.class', 'visible');

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

		transactionDetailsPage.getSaveButton().should('be.disabled');
		transactionDetailsPage.getDeleteButton().should('not.be.disabled');

		transactionDetailsPage
			.getDuplicateTitle()
			.contains('Possible Duplicates');
		transactionDetailsPage
			.getMarkNotDuplicateButton()
			.contains('This is Not a Duplicate');
		transactionDetailsPage.getDuplicateRecords().should('have.length', 2);
		testDuplicate(
			() => transactionDetailsPage.getDuplicateRecords().eq(0),
			0
		);
		testDuplicate(
			() => transactionDetailsPage.getDuplicateRecords().eq(1),
			1
		);

		cy.wait(`@getPossibleDuplicates_${transactionId}`).then((xhr) => {
			expect(xhr.request.url).matches(/^.*\?pageNumber=0&pageSize=10$/);
		});
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
		const transactionId = allTransactions.transactions[0].id;
		const secondId = possibleDuplicates.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails_duplicate(transactionId);
		transactionsApi.getPossibleDuplicates(transactionId);
		transactionsApi.getTransactionDetails(secondId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();

		transactionDetailsPage.getDuplicateTitle().should('be.visible');
		transactionDetailsPage.getDuplicateRecords().should('have.length', 2);

		transactionDetailsPage
			.getOpenButtonForDuplicateRecord(
				transactionDetailsPage.getDuplicateRecords().eq(0)
			)
			.click();

		cy.wait(`@getTransactionDetails_${secondId}`);
	});

	it('can mark transaction as not a duplicate', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		transactionsApi.getNeedsAttention();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_duplicate(transactionId);
		transactionsApi.getPossibleDuplicates(transactionId);
		transactionsApi.markNotDuplicate(transactionId);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();

		transactionDetailsPage.getDuplicateRecords().should('have.length', 2);
		transactionDetailsPage.getMarkNotDuplicateButton().click();

		cy.wait(`@markNotDuplicate_${transactionId}`);
		cy.get(`@markNotDuplicate_${transactionId}.all`).should(
			'have.length',
			1
		);

		cy.wait('@searchForTransactions');
		cy.wait('@getNeedsAttention');
		cy.wait(`@getTransactionDetails_duplicate_${transactionId}`);
		cy.wait(`@getPossibleDuplicates_${transactionId}`);

		cy.get(`@getTransactionDetails_duplicate_${transactionId}.all`).should(
			'have.length',
			2
		);
		cy.get('@searchForTransactions.all').should('have.length', 2);
		cy.get('@getNeedsAttention.all').should('have.length', 2);

		// TODO this is only being called again because I'm not changing the transaction details response
		cy.get(`@getPossibleDuplicates_${transactionId}.all`).should(
			'have.length',
			2
		);
	});
});
