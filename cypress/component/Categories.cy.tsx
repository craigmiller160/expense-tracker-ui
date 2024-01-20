import { categoriesApi } from './testutils/apis/categories';
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
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/categories'
		});
		navbarPage
			.getNavbarItems()
			.filter(
				(index, $node) =>
					$node.textContent === authorizedNavbarItems.categories
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
		categoriesApi.getAllCategories();
		categoriesApi.createCategory();
		mountApp({
			initialRoute: '/categories'
		});
		categoriesListPage.getAddButton().contains('Add Category').click();
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
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/categories'
		});
		categoriesListPage.getDetailsButtons().eq(0).click();
		categoryDetailsPage
			.getSaveButton()
			.contains('Save')
			.should('be.disabled');
		categoryDetailsPage
			.getCategoryNameInputHelperText()
			.should('not.exist');

		categoryDetailsPage.getCategoryNameInput().clear();
		categoryDetailsPage
			.getCategoryNameInputHelperText()
			.contains('Must provide a name');
		categoryDetailsPage
			.getSaveButton()
			.contains('Save')
			.should('be.disabled');

		categoryDetailsPage.getCategoryNameInput().type('Hello');
		categoryDetailsPage
			.getCategoryNameInputHelperText()
			.should('not.exist');
		categoryDetailsPage
			.getSaveButton()
			.contains('Save')
			.should('not.be.disabled');
	});

	it('updates category name', () => {
		const firstCategoryId = allCategories[0].id;
		categoriesApi.getAllCategories();
		categoriesApi.updateCategory(firstCategoryId);
		mountApp({
			initialRoute: '/categories'
		});
		categoriesListPage.getDetailsButtons().eq(0).click();
		categoryDetailsPage.getHeaderTitle().contains(allCategories[0].name);
		categoryDetailsPage.getContentTitle().contains('Category Information');
		categoryDetailsPage.getDeleteButton().should('exist');
		categoryDetailsPage
			.getSaveButton()
			.contains('Save')
			.should('be.disabled');
		categoryDetailsPage.getCategoryNameLabel().contains('Category Name');

		categoryDetailsPage
			.getCategoryNameInput()
			.should('have.value', allCategories[0].name)
			.clear()
			.type('Hello Category')
			.should('have.value', 'Hello Category');
		categoryDetailsPage.getSaveButton().should('not.be.disabled').click();

		cy.wait(`@updateCategory_${firstCategoryId}`).then((xhr) => {
			expect(xhr.request.body).to.eql({
				name: 'Hello Category'
			});
		});
	});

	it('deletes category', () => {
		const firstCategoryId = allCategories[0].id;
		categoriesApi.getAllCategories();
		categoriesApi.deleteCategory(firstCategoryId);
		mountApp({
			initialRoute: '/categories'
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

		cy.wait(`@deleteCategory_${firstCategoryId}`);
		confirmDialogPage.getTitle().should('not.be.visible');
	});
});
