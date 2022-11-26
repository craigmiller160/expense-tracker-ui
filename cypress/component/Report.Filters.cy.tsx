import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportFiltersPage } from './testutils/pages/reportFilters';
import { commonPage } from './testutils/pages/common';
import { pipe } from 'fp-ts/es6/function';
import { orderedCategoryNames } from './testutils/constants/categories';

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

		pipe(
			reportFiltersPage.getCategoryInput(),
			commonPage.getMultipleSelectValues
		).each(($value, index) =>
			expect($value.text()).eq(orderedCategoryNames[index])
		);
	});
});
