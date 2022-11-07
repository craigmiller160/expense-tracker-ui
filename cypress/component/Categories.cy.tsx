import { getAllCategories } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import { orderedCategoryNames } from './testutils/constants/categories';
import { authorizedNavbarItems } from './testutils/constants/navbar';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesPage } from './testutils/pages/categories';

describe('Manage Categories', () => {
	it('displays all categories on the server', () => {
		getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
		navbarPage
			.getNavbarItems()
			.filter(
				(index, $node) =>
					$node.textContent === authorizedNavbarItems.manageCategories
			)
			.should('have.class', 'active');
		categoriesPage.getTitle().contains('Manage Categories');
		categoriesPage
			.getCategoryNames()
			.each(($node, index) =>
				expect($node.text()).to.eq(orderedCategoryNames[index])
			);
		categoriesPage
			.getDetailsButtons()
			.each(($node) => expect($node.text()).to.eq('Details'));
	});

	it('adds new category', () => {
		throw new Error();
	});

	it('will not save category without name', () => {
		throw new Error();
	});

	it('updates category name', () => {
		throw new Error();
	});

	it('deletes category', () => {
		throw new Error();
	});
});
