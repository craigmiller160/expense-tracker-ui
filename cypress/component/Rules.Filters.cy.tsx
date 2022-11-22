import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import { rulesListFiltersPage } from './testutils/pages/rulesListFilters';

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
		throw new Error();
	});

	it('applies category filter', () => {
		throw new Error();
	});
});
