import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';

describe('Rule Details', () => {
	it('opens existing rule with minimum fields filled', () => {
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		throw new Error();
	});

	it('opens existing rule with maximum fields filled', () => {
		throw new Error();
	});

	it('can add a new rule', () => {
		throw new Error();
	});

	it('can update an existing rule', () => {
		throw new Error();
	});

	it('input validation rules', () => {
		throw new Error();
	});

	it('can delete an existing rule', () => {
		throw new Error();
	});
});
