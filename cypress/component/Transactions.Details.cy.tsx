import { mountApp } from './testutils/mountApp';
import { transactionsApi } from './testutils/apis/transactions';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import {
	allTransactions,
	possibleDuplicates,
	transactionDetails
} from './testutils/constants/transactions';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionDetailsPage } from './testutils/pages/transactionDetails';
import type { TransactionDetailsResponse } from '../../src/types/generated/expense-tracker';
import { categoriesApi } from './testutils/apis/categories';
import {
	serverDateTimeToDisplayDateTime,
	serverDateToDisplayDate
} from '../../src/utils/dateTimeUtils';
import { commonPage } from './testutils/pages/common';
import {
	orderedCategoryIds,
	orderedCategoryNames
} from './testutils/constants/categories';
import { validateInputRules } from './testutils/validations/inputRules';
import { lastAppliedApi } from './testutils/apis/lastApplied';
import { match } from 'ts-pattern';

type Chainable<T> = Cypress.Chainable<T>;

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
			.contains(
				possibleDuplicates.transactions[index].categoryName ?? ''
			);
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		mountApp({
			initialRoute: '/transactions'
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails(transactionId);
		lastAppliedApi.getLastRuleApplied(transactionId);
		mountApp({
			initialRoute: '/transactions'
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

		transactionDetailsPage
			.getLastRuleAppliedTitle()
			.contains('Auto-Categorize Rule Applied');
		transactionDetailsPage.getLastRuleOrdinal().contains('5');
		transactionDetailsPage.getLastRuleCategory().contains('Groceries');
		transactionDetailsPage
			.getLastRuleInfo()
			.find('li')
			.each(($li, index) => {
				match(index)
					.with(0, () => expect($li.text()).eq('Regex: /.*TARGET.*/'))
					.with(1, () => expect($li.text()).eq('Dates: Any to Any'))
					.with(2, () => expect($li.text()).eq('Amounts: Any to Any'))
					.run();
			});
	});

	it('shows current transaction information for confirmed and categorized', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_confirmedAndCategorized(
			transactionId
		);
		mountApp({
			initialRoute: '/transactions'
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

		transactionDetailsPage.getLastRuleAppliedTitle().should('not.exist');
	});

	it('shows current transaction information for possible refunds', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_possibleRefund(transactionId);
		mountApp({
			initialRoute: '/transactions'
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_duplicate(transactionId);
		transactionsApi.getPossibleDuplicates(transactionId);
		mountApp({
			initialRoute: '/transactions'
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		transactionsApi.updateTransactionDetails(transactionId);
		lastAppliedApi.getLastRuleApplied_noRule(transactionId);
		mountApp({
			initialRoute: '/transactions'
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		lastAppliedApi.getLastRuleApplied_noRule(transactionId);
		mountApp({
			initialRoute: '/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();
		const validateInput = validateInputRules({
			getSaveButton: transactionDetailsPage.getSaveButton
		});
		validateInput({
			getInput: transactionDetailsPage.getExpenseDateInput,
			getHelperText: transactionDetailsPage.getExpenseDateInputHelperText
		})({
			invalidValue: '',
			validValue: '01/02/2022',
			errorMessage: 'Expense Date is required'
		});
		validateInput({
			getInput: transactionDetailsPage.getAmountInput,
			getHelperText: transactionDetailsPage.getAmountInputHelperText
		})({
			invalidValue: '',
			validValue: '-10.00',
			errorMessage: 'Amount is required'
		});
		validateInput({
			getInput: transactionDetailsPage.getDescriptionInput,
			getHelperText: transactionDetailsPage.getDescriptionHelperText
		})({
			errorMessage: 'Description is required',
			validValue: 'Hello World',
			invalidValue: ''
		});
	});

	it('can categorize transaction', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		transactionsApi.updateTransactionDetails(transactionId);
		lastAppliedApi.getLastRuleApplied_noRule(transactionId);

		mountApp({
			initialRoute: '/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();
		transactionDetailsPage.getSaveButton().should('be.disabled');
		transactionDetailsPage.getCategorySelectInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
		transactionDetailsPage
			.getCategorySelectInput()
			.should('have.value', orderedCategoryNames[0]);

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
							categoryId: orderedCategoryIds[0],
							confirmed: false
						});
					})
		);
	});

	it('can confirm transaction', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails(transactionId);
		transactionsApi.updateTransactionDetails(transactionId);
		lastAppliedApi.getLastRuleApplied_noRule(transactionId);
		mountApp({
			initialRoute: '/transactions'
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.getTransactionDetails_duplicate(transactionId);
		transactionsApi.getPossibleDuplicates(transactionId);
		transactionsApi.getTransactionDetails(secondId);
		lastAppliedApi.getLastRuleApplied_noRule(transactionId);
		lastAppliedApi.getLastRuleApplied_noRule(secondId);
		mountApp({
			initialRoute: '/transactions'
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
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails_duplicate(transactionId);
		transactionsApi.getPossibleDuplicates(transactionId);
		transactionsApi.markNotDuplicate(transactionId);
		mountApp({
			initialRoute: '/transactions'
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
		cy.wait('@getNeedsAttention_all');
		cy.wait(`@getTransactionDetails_duplicate_${transactionId}`);
		cy.wait(`@getPossibleDuplicates_${transactionId}`);

		cy.get(`@getTransactionDetails_duplicate_${transactionId}.all`).should(
			'have.length',
			2
		);
		cy.get('@searchForTransactions.all').should('have.length', 2);
		cy.get('@getNeedsAttention_all.all').should('have.length', 2);

		// this is only being called again because I'm not changing the transaction details response
		cy.get(`@getPossibleDuplicates_${transactionId}.all`).should(
			'have.length',
			2
		);
	});

	it('does not show last applied rule for unconfirmed transaction if there is none', () => {
		const transactionId = allTransactions.transactions[0].id;
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		transactionsApi.createTransaction();
		transactionsApi.getTransactionDetails(transactionId);
		lastAppliedApi.getLastRuleApplied_noRule(transactionId);
		mountApp({
			initialRoute: '/transactions'
		});

		transactionsListPage.getDetailsButtons().eq(0).click();

		transactionDetailsPage.getAmountInput().should('be.visible');
		transactionDetailsPage.getLastRuleAppliedTitle().should('not.exist');
	});
});
