import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportFiltersPage } from './testutils/pages/reportFilters';
import { commonPage } from './testutils/pages/common';

describe('Report Filters', () => {
	it('can exclude categories', () => {
		reportsApi.getSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});

		reportFiltersPage.getCategoryLabel().contains('Excluded Categories');

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(0).click();

		reportFiltersPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(1).click();

		reportFiltersPage.getCategoryInput().should('have.value', '');
	});
});
