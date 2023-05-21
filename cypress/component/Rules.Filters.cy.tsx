import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import { rulesListFiltersPage } from './testutils/pages/rulesListFilters';
import { Interception } from 'cypress/types/net-stubbing';
import { commonPage } from './testutils/pages/common';
import {
	orderedCategoryIds,
	orderedCategoryNames
} from './testutils/constants/categories';

const validateQueryString = (url: string, expectedQuery: string) => {
	const query = url.split('?')[1];
	expect(query).eq(expectedQuery);
};

describe('Rules Filters', () => {
	it('renders the filters', () => {
		rulesApi.getAllRules();
		rulesApi.getMaxOrdinal();
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListFiltersPage.getRegexFilterLabel().should('have.text', 'Regex');
		rulesListFiltersPage
			.getCategoryFilterLabel()
			.should('have.text', 'Category');
	});

	it('applies regex filter', () => {
		rulesApi.getAllRules();
		rulesApi.getMaxOrdinal();
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListFiltersPage.getRegexFilterInput().type('Hello');
		rulesListFiltersPage
			.getRegexFilterInput()
			.should('have.value', 'Hello');

		cy.get('@getAllRules.all')
			.should('have.length', 6)
			.then(($xhrs) => {
				const requests =
					$xhrs as unknown as ReadonlyArray<Interception>;

				validateQueryString(
					requests[0].request.url,
					'pageNumber=0&pageSize=25&regex='
				);
				validateQueryString(
					requests[5].request.url,
					'pageNumber=0&pageSize=25&regex=Hello'
				);
			});
	});

	it('applies category filter', () => {
		rulesApi.getAllRules();
		rulesApi.getMaxOrdinal();
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListFiltersPage.getCategoryFilterInput().click();
		commonPage.getOpenSelectOptions().eq(0).click();
		rulesListFiltersPage
			.getCategoryFilterInput()
			.should('have.value', orderedCategoryNames[0]);

		cy.get('@getAllRules.all')
			.should('have.length', 2)
			.then(($xhrs) => {
				const requests =
					$xhrs as unknown as ReadonlyArray<Interception>;

				validateQueryString(
					requests[0].request.url,
					'pageNumber=0&pageSize=25&regex='
				);
				validateQueryString(
					requests[1].request.url,
					`pageNumber=0&pageSize=25&categoryId=${orderedCategoryIds[0]}&regex=`
				);
			});
	});
});
