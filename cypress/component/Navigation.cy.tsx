import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportsApi } from './testutils/apis/reports';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesListPage } from './testutils/pages/categoriesList';
import { reportsPage } from './testutils/pages/reports';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionsApi } from './testutils/apis/transactions';

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
		});

		it('navigates to Transactions', () => {
			categoriesApi.getAllCategories();
			transactionsApi.searchForTransactions();
			mountApp({
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getTransactionsItem().click();
			transactionsListPage.getTitle().should('be.visible');
		});

		it('navigates to Categories', () => {
			reportsApi.getSpendingByMonthAndCategory();
			categoriesApi.getAllCategories();
			mountApp({
				initialRoute: '/expense-tracker/reports'
			});
			reportsPage.getTitle().should('be.visible');
			navbarPage.getCategoriesItem().click();
			categoriesListPage.getTitle().should('be.visible');
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
