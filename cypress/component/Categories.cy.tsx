import { getAllCategories, createCategory } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import { orderedCategoryNames } from './testutils/constants/categories';
import { authorizedNavbarItems } from './testutils/constants/navbar';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesListPage } from './testutils/pages/categoriesList';
import { categoryDetailsPage } from './testutils/pages/categoryDetails';

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
		categoriesListPage.getTitle().contains('Manage Categories');
		categoriesListPage
			.getCategoryNames()
			.each(($node, index) =>
				expect($node.text()).to.eq(orderedCategoryNames[index])
			);
		categoriesListPage
			.getDetailsButtons()
			.each(($node) => expect($node.text()).to.eq('Details'));
		categoriesListPage.getAddButton().contains('Add');
	});

	it('adds new category', () => {
		getAllCategories();
		createCategory();
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
		categoriesListPage.getAddButton().click();
		categoryDetailsPage.getHeaderTitle().contains('New Category');
		categoryDetailsPage.getContentTitle().contains('Category Information');
		categoryDetailsPage.getDeleteButton().should('not.exist');
		categoryDetailsPage
			.getSaveButton()
			.contains('Save')
			.should('not.be.disabled');
		categoryDetailsPage.getCategoryNameLabel().contains('Category Name');

		categoryDetailsPage
			.getCategoryNameInput()
			.should('have.value', 'New Category')
			.clear()
			.type('Hello Category')
			.should('have.value', 'Hello Category');
		categoryDetailsPage.getSaveButton().click();

		cy.wait('@createCategory').then((xhr) => {
			expect(JSON.stringify(xhr.request.body)).to.eq(
				JSON.stringify({
					name: 'Hello Category'
				})
			);
		});
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
