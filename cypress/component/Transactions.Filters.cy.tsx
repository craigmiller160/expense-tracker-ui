import { categoriesApi } from './testutils/apis/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';
import { transactionFilters } from './testutils/pages/transactionFilters';
import { subMonths, format } from 'date-fns/fp';
import { flow } from 'fp-ts/es6/function';
import { commonPage } from './testutils/pages/common';
import { orderedCategoryNames } from './testutils/constants/categories';
import {
	yesNoOptionNames,
	orderByOptionNames
} from './testutils/constants/transactions';

const DATE_FORMAT = 'MM/dd/yyyy';

const defaultStartDate = flow(subMonths(1), format(DATE_FORMAT))(new Date());
const defaultEndDate = format(DATE_FORMAT)(new Date());

describe('Transactions Filters', () => {
	it('renders all filters', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionFilters
			.getStartDateLabel()
			.should('have.text', 'Start Date');
		transactionFilters
			.getStartDateInput()
			.should('have.value', defaultStartDate);

		transactionFilters.getEndDateLabel().should('have.text', 'End Date');
		transactionFilters
			.getEndDateInput()
			.should('have.value', defaultEndDate);

		transactionFilters.getCategoryLabel().should('have.text', 'Category');
		transactionFilters.getCategoryInput().should('have.value', '');

		transactionFilters.getOrderByLabel().should('have.text', 'Order By');
		transactionFilters.getOrderByInput().should('have.value', 'DESC');

		transactionFilters.getDuplicateLabel().should('have.text', 'Duplicate');
		transactionFilters.getDuplicateInput().should('have.value', 'ALL');

		transactionFilters.getConfirmedLabel().should('have.text', 'Confirmed');
		transactionFilters.getConfirmedInput().should('have.value', 'ALL');

		transactionFilters
			.getCategorizedLabel()
			.should('have.text', 'Categorized');
		transactionFilters.getCategorizedInput().should('have.value', 'ALL');

		transactionFilters
			.getPossibleRefundLabel()
			.should('have.text', 'Possible Refund');
		transactionFilters.getPossibleRefundInput().should('have.value', 'ALL');

		transactionFilters.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().each(($value, index) => {
			expect($value.text()).to.eq(orderedCategoryNames[index]);
		});

		transactionFilters.getOrderByInputWrapper().click();
		commonPage
			.getOpenSelectOptions()
			.each(($value, index) =>
				expect($value.text()).to.eq(orderByOptionNames[index])
			);
		commonPage.dismissPopupOptions();

		transactionFilters.getConfirmedInputWrapper().click();
		commonPage
			.getOpenSelectOptions()
			.each(($value, index) =>
				expect($value.text()).to.eq(yesNoOptionNames[index])
			);
		commonPage.dismissPopupOptions();

		transactionFilters.getCategorizedInputWrapper().click();
		commonPage
			.getOpenSelectOptions()
			.each(($value, index) =>
				expect($value.text()).to.eq(yesNoOptionNames[index])
			);
		commonPage.dismissPopupOptions();

		transactionFilters.getPossibleRefundInputWrapper().click();
		commonPage
			.getOpenSelectOptions()
			.each(($value, index) =>
				expect($value.text()).to.eq(yesNoOptionNames[index])
			);
		commonPage.dismissPopupOptions();

		transactionFilters.getDuplicateInputWrapper().click();
		commonPage
			.getOpenSelectOptions()
			.each(($value, index) =>
				expect($value.text()).to.eq(yesNoOptionNames[index])
			);
	});

	it('possible refund control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactionsWithQuery(
			'.*possibleRefund=ALL.*',
			'possibleRefundAll'
		);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionFilters
			.getPossibleRefundLabel()
			.should('have.text', 'Possible Refund');
		cy.wait('@possibleRefundAll');

		transactionsApi.searchForTransactionsWithQuery(
			'.*possibleRefund=YES.*',
			'possibleRefundYes'
		);
		transactionsApi.searchForTransactionsWithQuery(
			'.*possibleRefund=NO.*',
			'possibleRefundNo'
		);

		transactionFilters.getPossibleRefundInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		cy.wait('@possibleRefundYes');

		transactionFilters.getPossibleRefundInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(2).click();
		cy.wait('@possibleRefundNo');
	});

	it('category control', () => {
		throw new Error();
	});

	it('duplicate control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactionsWithQuery(
			'.*duplicate=ALL.*',
			'duplicatedAll'
		);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionFilters.getDuplicateLabel().should('have.text', 'Duplicate');
		cy.wait('@duplicateAll');

		transactionsApi.searchForTransactionsWithQuery(
			'.*duplicate=YES.*',
			'duplicateYes'
		);
		transactionsApi.searchForTransactionsWithQuery(
			'.*duplicate=NO.*',
			'duplicatedNo'
		);

		transactionFilters.getDuplicateInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		cy.wait('@duplicateYes');

		transactionFilters.getDuplicateInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(2).click();
		cy.wait('@duplicateNo');
	});

	it('categorized control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactionsWithQuery(
			'.*categorized=ALL.*',
			'categorizedAll'
		);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionFilters
			.getCategorizedLabel()
			.should('have.text', 'Categorized');
		cy.wait('@categorizedAll');

		transactionsApi.searchForTransactionsWithQuery(
			'.*categorized=YES.*',
			'categorizedYes'
		);
		transactionsApi.searchForTransactionsWithQuery(
			'.*categorized=NO.*',
			'categorizedNo'
		);

		transactionFilters.getCategorizedInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		cy.wait('@categorizedYes');

		transactionFilters.getCategorizedInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(2).click();
		cy.wait('@categorizedNo');
	});

	it('confirmed control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactionsWithQuery(
			'.*confirmed=ALL.*',
			'confirmedAll'
		);
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionFilters.getConfirmedLabel().should('have.text', 'Confirmed');
		cy.wait('@confirmedAll');

		transactionsApi.searchForTransactionsWithQuery(
			'.*confirmed=YES.*',
			'confirmedYes'
		);
		transactionsApi.searchForTransactionsWithQuery(
			'.*confirmed=NO.*',
			'confirmedNo'
		);

		transactionFilters.getConfirmedInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		cy.wait('@confirmedYes');

		transactionFilters.getConfirmedInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(2).click();
		cy.wait('@confirmedNo');
	});
});
