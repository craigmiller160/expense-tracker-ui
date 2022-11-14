import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportsApi } from './testutils/apis/reports';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesListPage } from './testutils/pages/categoriesList';
import { reportsPage } from './testutils/pages/reports';

describe('Navigation', () => {
	describe('Desktop', () => {
		it('navigates to Reports', () => {
			categoriesApi.getAllCategories();
			reportsApi.getSpendingByMonthAndCategory();
			mountApp({
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getReportsItem().click();
			reportsPage.getTitle().should('be.visible');
			cy.url().should('match', /^.*\/reports$/);
		});

		it('navigates to Transactions', () => {
			throw new Error();
		});

		it('navigates to Categories', () => {
			throw new Error();
		});

		it('navigates to Import', () => {
			throw new Error();
		});
	});

	describe('Mobile', () => {
		it('navigates to Reports', () => {
			throw new Error();
		});

		it('navigates to Transactions', () => {
			throw new Error();
		});

		it('navigates to Categories', () => {
			throw new Error();
		});

		it('navigates to Import', () => {
			throw new Error();
		});
	});
});
