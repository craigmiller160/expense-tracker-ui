import { getAllCategories } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';

describe('Manage Categories', () => {
	it('displays all categories on the server', () => {
		getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
	});
});
