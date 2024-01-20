import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import { rulesListFiltersPage } from './testutils/pages/rulesListFilters';
import { commonPage } from './testutils/pages/common';
import {
	orderedCategoryIds,
	orderedCategoryNames
} from './testutils/constants/categories';

type Interception = Readonly<{
	request: Readonly<{
		url: string;
	}>;
}>;

const validateQueryString = (url: string, expectedQuery: string) => {
	const query = url.split('?')[1];
	expect(query).eq(expectedQuery);
};

describe('Rules Filters', () => {
	it('clears all filters', () => {
		rulesApi.getAllRules();
		rulesApi.getMaxOrdinal();
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/rules'
		});

		rulesListFiltersPage.getRegexFilterInput().type('Hello');
		rulesListFiltersPage
			.getRegexFilterInput()
			.should('have.value', 'Hello');

		rulesListFiltersPage.getCategoryFilterInput().click();
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
		rulesListFiltersPage
			.getCategoryFilterInput()
			.should('have.value', orderedCategoryNames[0]);

		rulesListFiltersPage.getResetFilterButton().click();

		rulesListFiltersPage.getRegexFilterInput().should('have.value', '');
		rulesListFiltersPage.getCategoryFilterInput().should('have.value', '');
	});

	it('renders the filters', () => {
		rulesApi.getAllRules();
		rulesApi.getMaxOrdinal();
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/rules'
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
			initialRoute: '/rules'
		});

		rulesListFiltersPage.getRegexFilterInput().type('Hello');
		rulesListFiltersPage
			.getRegexFilterInput()
			.should('have.value', 'Hello');

		cy.get('@getAllRules.all')
			.should('have.length', 1)
			.then(($xhrs) => {
				const requests =
					$xhrs as unknown as ReadonlyArray<Interception>;

				validateQueryString(
					requests[0].request.url,
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
		commonPage.getOpenAutoCompleteOptions().eq(0).click();
		rulesListFiltersPage
			.getCategoryFilterInput()
			.should('have.value', orderedCategoryNames[0]);

		cy.get('@getAllRules.all')
			.should('have.length', 1)
			.then(($xhrs) => {
				const requests =
					$xhrs as unknown as ReadonlyArray<Interception>;
				validateQueryString(
					requests[0].request.url,
					`pageNumber=0&pageSize=25&categoryId=${orderedCategoryIds[0]}&regex=`
				);
			});
	});
});
