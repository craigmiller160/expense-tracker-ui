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
import { Interception } from 'cypress/types/net-stubbing';
import { needsAttentionApi } from './testutils/apis/needsAttention';

const excludedIds = (): string =>
	pipe(orderedCategoryIds.slice(0, 2).join(','), encodeURIComponent);

describe('Report Filters', () => {
	it('can exclude categories', () => {
		reportsApi.getSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});

		reportFiltersPage.getCategoryLabel().contains('Excluded Categories');

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

		cy.wait(300);
		cy.get('@getSpendingByMonthAndCategory.all')
			.should('have.length', 4)
			.then(($xhrs) => {
				const xhr = (
					$xhrs as unknown as ReadonlyArray<Interception>
				)[2];
				expect(xhr.request.url).to.match(
					RegExp(`^.*excludeCategoryIds=${excludedIds()}$`)
				);
			});
	});
});
