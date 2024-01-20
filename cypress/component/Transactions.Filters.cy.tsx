import { categoriesApi } from './testutils/apis/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';
import { transactionFilters } from './testutils/pages/transactionFilters';
import { subMonths, format, subDays, addDays } from 'date-fns/fp';
import { commonPage } from './testutils/pages/common';
import {
	orderedCategoryIds,
	orderedCategoryNames
} from './testutils/constants/categories';
import {
	yesNoOptionNames,
	orderByOptionNames
} from './testutils/constants/transactions';

const DATE_FORMAT = 'MM/dd/yyyy';

const defaultEndDate = new Date();
const defaultStartDate = subMonths(1)(defaultEndDate);
const defaultStartDateString = format(DATE_FORMAT)(defaultStartDate);
const defaultEndDateString = format(DATE_FORMAT)(defaultEndDate);

const newStartDate = subDays(1)(defaultStartDate);
const newEndDate = addDays(1)(defaultEndDate);
const newStartDateString = format(DATE_FORMAT)(newStartDate);
const newEndDateString = format(DATE_FORMAT)(newEndDate);

describe('Transactions Filters', () => {
	it('description control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
		});

		const description = 'Hello';

		transactionsApi.searchForTransactionsWithQuery(
			`.*description=${description}.*`,
			'descriptionSearch'
		);

		transactionFilters.getDescriptionFilterInput().type(description);
		cy.wait('@descriptionSearch');
	});

	it('clears all filters', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
		});

		transactionFilters.getStartDateInput().clear();
		transactionFilters.getStartDateInput().type(newStartDateString);
		transactionFilters
			.getStartDateInput()
			.should('have.value', newStartDateString);

		transactionFilters.getEndDateInput().clear();
		transactionFilters.getEndDateInput().type(newEndDateString);
		transactionFilters
			.getEndDateInput()
			.should('have.value', newEndDateString);

		transactionFilters.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
		transactionFilters
			.getCategoryInput()
			.should('have.value', orderedCategoryNames[0]);

		transactionFilters.getOrderByInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		transactionFilters.getOrderByInput().should('have.value', 'ASC');

		transactionFilters.getDuplicateInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		transactionFilters.getDuplicateInput().should('have.value', 'YES');

		transactionFilters.getCategorizedInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		transactionFilters.getCategorizedInput().should('have.value', 'YES');

		transactionFilters.getConfirmedInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		transactionFilters.getConfirmedInput().should('have.value', 'YES');

		transactionFilters.getPossibleRefundInputWrapper().click();
		commonPage.getOpenSelectOptions().eq(1).click();
		transactionFilters.getPossibleRefundInput().should('have.value', 'YES');

		transactionFilters.getResetFilterButton().click();

		transactionFilters
			.getStartDateInput()
			.should('have.value', defaultStartDateString);
		transactionFilters
			.getEndDateInput()
			.should('have.value', defaultEndDateString);
		transactionFilters.getCategoryInput().should('have.value', '');
		transactionFilters.getOrderByInput().should('have.value', 'DESC');
		transactionFilters.getDuplicateInput().should('have.value', 'ALL');
		transactionFilters.getCategorizedInput().should('have.value', 'ALL');
		transactionFilters.getPossibleRefundInput().should('have.value', 'ALL');
		transactionFilters.getConfirmedInput().should('have.value', 'ALL');
	});

	it('renders all filters', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
		});

		transactionFilters
			.getStartDateLabel()
			.should('have.text', 'Start Date');
		transactionFilters
			.getStartDateInput()
			.should('have.value', defaultStartDateString);

		transactionFilters.getEndDateLabel().should('have.text', 'End Date');
		transactionFilters
			.getEndDateInput()
			.should('have.value', defaultEndDateString);

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

		transactionFilters
			.getDescriptionFilterLabel()
			.should('have.text', 'Description');
	});

	it('possible refund control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactionsWithQuery(
			'.*possibleRefund=ALL.*',
			'possibleRefundAll'
		);
		mountApp({
			initialRoute: '/transactions'
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
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/transactions'
		});

		transactionsApi.searchForTransactionsWithQuery(
			`.*categoryIds=${orderedCategoryIds[0]}.*`,
			'categorySearch'
		);

		transactionFilters.getCategoryLabel().should('have.text', 'Category');
		transactionFilters.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
		cy.wait('@categorySearch');
	});

	it('duplicate control', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactionsWithQuery(
			'.*duplicate=ALL.*',
			'duplicateAll'
		);
		mountApp({
			initialRoute: '/transactions'
		});

		transactionFilters.getDuplicateLabel().should('have.text', 'Duplicate');
		cy.wait('@duplicateAll');

		transactionsApi.searchForTransactionsWithQuery(
			'.*duplicate=YES.*',
			'duplicateYes'
		);
		transactionsApi.searchForTransactionsWithQuery(
			'.*duplicate=NO.*',
			'duplicateNo'
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
			initialRoute: '/transactions'
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
			initialRoute: '/transactions'
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
