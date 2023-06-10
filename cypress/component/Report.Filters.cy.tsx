import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportFiltersPage } from './testutils/pages/reportFilters';
import { commonPage } from './testutils/pages/common';
import { pipe } from 'fp-ts/es6/function';
import {
	orderedCategoryIds,
	orderedCategoryNames
} from './testutils/constants/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';

describe('Report Filters', () => {
	it('renders filters correctly', () => {
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});

		reportFiltersPage.getCategoryLabel().contains('Categories');
		reportFiltersPage.getFilterTypeLabel().contains('Filter Type');

		reportFiltersPage.getFilterTypeInput().should('have.value', 'Include');
		pipe(
			reportFiltersPage.getCategoryInput(),
			commonPage.getMultipleSelectValues
		).should('have.length', 0);
	});

	it('can include categories', () => {
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});

		const categoryIds = orderedCategoryIds.slice(0, 2);
		reportsApi.getSpendingByMonthAndCategory(
			`categoryIdType=INCLUDE&categoryIds=${categoryIds[0]}`,
			'addFirstCategory'
		);
		reportsApi.getSpendingByMonthAndCategory(
			`categoryIdType=INCLUDE&categoryIds=${categoryIds.join(',')}`,
			'addSecondCategory'
		);

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(0).click();

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(1).click();

		pipe(
			reportFiltersPage.getCategoryInput(),
			commonPage.getMultipleSelectValues
		).each(($value, index) =>
			expect($value.text()).eq(orderedCategoryNames[index])
		);

		cy.wait('@addFirstCategory');
		cy.wait('@addSecondCategory');
	});

	it('can exclude categories', () => {
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});

		reportsApi.getSpendingByMonthAndCategory(
			'categoryIdType=EXCLUDE&categoryIds=',
			'setTypeToExclude'
		);
		const categoryIds = orderedCategoryIds.slice(0, 2);
		reportsApi.getSpendingByMonthAndCategory(
			`categoryIdType=EXCLUDE&categoryIds=${categoryIds[0]}`,
			'addFirstCategory'
		);
		reportsApi.getSpendingByMonthAndCategory(
			`categoryIdType=EXCLUDE&categoryIds=${categoryIds.join(',')}`,
			'addSecondCategory'
		);

		reportFiltersPage.getFilterTypeInput().click();
		commonPage.getOpenSelectOptions().eq(1).click();

		reportFiltersPage.getFilterTypeInput().should('have.value', 'Exclude');

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(0).click();

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(1).click();

		pipe(
			reportFiltersPage.getCategoryInput(),
			commonPage.getMultipleSelectValues
		).each(($value, index) =>
			expect($value.text()).eq(orderedCategoryNames[index])
		);

		cy.wait('@setTypeToExclude');
		cy.wait('@addFirstCategory');
		cy.wait('@addSecondCategory');
	});
});
