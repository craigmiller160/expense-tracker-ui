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
import { orderCategoriesByNames } from './testutils/constants/reports';

describe('Report Filters', () => {
	it('renders filters correctly', () => {
		categoriesApi.getUnknownCategory();
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

		reportFiltersPage.getCategoryInput().click();
		const categoryNames = [...orderedCategoryNames, 'Unknown'].sort();

		commonPage
			.getOpenAutoCompleteOptions()
			.each(($value, index) =>
				expect($value.text()).eq(categoryNames[index])
			);
		commonPage.dismissPopupOptions();

		reportFiltersPage
			.getOrderCategoriesByLabel()
			.should('have.text', 'Order Categories By');
		reportFiltersPage
			.getOrderCategoriesByInput()
			.should('have.value', 'CATEGORY');
		reportFiltersPage.getOrderCategoriesByInputWrapper().click();
		commonPage
			.getOpenSelectOptions()
			.each(($value, index) =>
				expect($value.text()).eq(orderCategoriesByNames[index])
			);
	});

	it('can include categories', () => {
		categoriesApi.getUnknownCategory();
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
			`categoryIdType=INCLUDE&categoryIds=${encodeURIComponent(
				categoryIds.join(',')
			)}`,
			'addSecondCategory'
		);

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();

		cy.wait('@addFirstCategory');

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(1).click();

		cy.wait('@addSecondCategory');

		pipe(
			reportFiltersPage.getCategoryInput(),
			commonPage.getMultipleSelectValues
		).each(($value, index) =>
			expect($value.text()).eq(orderedCategoryNames[index])
		);
	});

	it('can exclude categories', () => {
		categoriesApi.getUnknownCategory();
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});

		reportsApi.getSpendingByMonthAndCategory(
			'categoryIdType=EXCLUDE',
			'setTypeToExclude'
		);
		const categoryIds = orderedCategoryIds.slice(0, 2);
		reportsApi.getSpendingByMonthAndCategory(
			`categoryIdType=EXCLUDE&categoryIds=${categoryIds[0]}`,
			'addFirstCategory'
		);
		reportsApi.getSpendingByMonthAndCategory(
			`categoryIdType=EXCLUDE&categoryIds=${encodeURIComponent(
				categoryIds.join(',')
			)}`,
			'addSecondCategory'
		);

		reportFiltersPage.getFilterTypeInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(1).click();

		cy.wait('@setTypeToExclude');

		reportFiltersPage.getFilterTypeInput().should('have.value', 'Exclude');

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();

		cy.wait('@addFirstCategory');

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(1).click();

		cy.wait('@addSecondCategory');

		pipe(
			reportFiltersPage.getCategoryInput(),
			commonPage.getMultipleSelectValues
		).each(($value, index) =>
			expect($value.text()).eq(orderedCategoryNames[index])
		);
	});

	it('report category order by', () => {
		throw new Error();
	});
});
