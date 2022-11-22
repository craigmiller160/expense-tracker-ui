import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import { rulesListFiltersPage } from './testutils/pages/rulesListFilters';
import { Interception } from 'cypress/types/net-stubbing';

const validateQueryString = (url: string, expectedQuery: string) => {
	const query = url.split('?')[1];
	expect(query).eq(expectedQuery);
};

describe('Rules Filters', () => {
	it('renders the filters', () => {
		rulesApi.getAllRules();
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
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListFiltersPage.getRegexFilterInput().type('Hello');
		cy.wait(300);
		cy.get('@getAllRules.all')
			.should('have.length', 2)
			.then(($xhrs) => {
				const requests =
					$xhrs as unknown as ReadonlyArray<Interception>;

				validateQueryString(
					requests[0].request.url,
					'pageNumber=0&pageSize=25'
				);
				validateQueryString(
					requests[1].request.url,
					'pageNumber=0&pageSize=25&regex=Hello'
				);
			});
	});

	it('applies category filter', () => {
		throw new Error();
	});
});
