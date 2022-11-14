import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportsApi } from './testutils/apis/reports';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesListPage } from './testutils/pages/categoriesList';
import { reportsPage } from './testutils/pages/reports';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionsApi } from './testutils/apis/transactions';
import { importPage } from './testutils/pages/importPage';

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
			categoriesApi.getAllCategories();
			mountApp({
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getImportItem().click();
			importPage.getTitle().should('be.visible');
		});
	});

	describe('Mobile', () => {
		it('navigates to Reports', () => {
			categoriesApi.getAllCategories();
			reportsApi.getSpendingByMonthAndCategory();
			mountApp({
				viewport: 'mobile',
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getMobileNavItemsButton().click();
			navbarPage.getReportsItem().click();
			reportsPage.getTitle().should('be.visible');
		});

		it('navigates to Transactions', () => {
			categoriesApi.getAllCategories();
			transactionsApi.searchForTransactions();
			mountApp({
				viewport: 'mobile',
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getMobileNavItemsButton().click();
			navbarPage.getTransactionsItem().click();
			transactionsListPage.getTitle().should('be.visible');
		});

		it('navigates to Categories', () => {
			reportsApi.getSpendingByMonthAndCategory();
			categoriesApi.getAllCategories();
			mountApp({
				viewport: 'mobile',
				initialRoute: '/expense-tracker/reports'
			});
			reportsPage.getTitle().should('be.visible');
			navbarPage.getMobileNavItemsButton().click();
			navbarPage.getCategoriesItem().click();
			categoriesListPage.getTitle().should('be.visible');
		});

		it('navigates to Import', () => {
			categoriesApi.getAllCategories();
			mountApp({
				viewport: 'mobile',
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getMobileNavItemsButton().click();
			navbarPage.getImportItem().click();
			importPage.getTitle().should('be.visible');
		});
	});
});
