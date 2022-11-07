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
			.getTableRows()
			.should('have.length', 4)

			.each(($node, index) => {
				expect($node.children('td')).length(2);
				const nameCell = $node.children('td').eq(0);
				expect(nameCell.text()).to.eq(orderedCategoryNames[index]);

				const detailsCell = $node
					.children('td')
					.eq(1)
					.children('button');
				expect(detailsCell.text()).to.eq('Details');
			});
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
