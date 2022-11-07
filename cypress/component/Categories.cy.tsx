import {
	getAllCategories,
	createCategory,
	deleteCategory
} from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';
import {
	allCategories,
	orderedCategoryNames
} from './testutils/constants/categories';
import { authorizedNavbarItems } from './testutils/constants/navbar';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesListPage } from './testutils/pages/categoriesList';
import { categoryDetailsPage } from './testutils/pages/categoryDetails';
import { confirmDialogPage } from './testutils/pages/confirmDialog';

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
			expect(xhr.request.body).to.eql({
				name: 'Hello Category'
			});
		});
	});

	it('will not save category without name', () => {
		// TODO update code to disable save button when name is blank
		throw new Error();
	});

	it('updates category name', () => {
		throw new Error();
	});

	it('deletes category', () => {
		const firstCategoryId = allCategories[0].id;
		getAllCategories();
		deleteCategory(firstCategoryId);
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
		categoriesListPage.getDetailsButtons().eq(0).click();
		categoryDetailsPage.getHeaderTitle().should('be.visible');
		categoryDetailsPage.getDeleteButton().click();

		confirmDialogPage.getTitle().contains('Confirm Deletion');
		confirmDialogPage
			.getMessage()
			.contains('Are you sure you want to delete this Category?');
		confirmDialogPage.getCancelButton().contains('Cancel');
		confirmDialogPage.getConfirmButton().click();

		cy.wait(`@deleteCategory_${firstCategoryId}`); // TODO double-check that this works
		confirmDialogPage.getTitle().should('not.be.visible');
	});
});
