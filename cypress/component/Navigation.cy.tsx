import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { reportsApi } from './testutils/apis/reports';
import { navbarPage } from './testutils/pages/navbar';
import { categoriesListPage } from './testutils/pages/categoriesList';
import { reportsPage } from './testutils/pages/reports';
import { transactionsListPage } from './testutils/pages/transactionsList';
import { transactionsApi } from './testutils/apis/transactions';
import { importPage } from './testutils/pages/importPage';
import { authorizedNavbarItems } from './testutils/constants/navbar';
import { needsAttentionApi } from './testutils/apis/needsAttention';

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
			navbarPage.getReportsItem().should('have.class', 'active');
			reportsPage.getTitle().should('be.visible');
		});

		it('navigates to Transactions', () => {
			categoriesApi.getAllCategories();
			transactionsApi.searchForTransactions();
			needsAttentionApi.getNeedsAttention_all();
			mountApp({
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getTransactionsItem().click();
			navbarPage.getTransactionsItem().should('have.class', 'active');
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
			navbarPage.getCategoriesItem().should('have.class', 'active');
			categoriesListPage.getTitle().should('be.visible');
		});

		it('navigates to Import', () => {
			categoriesApi.getAllCategories();
			mountApp({
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getImportItem().click();
			navbarPage.getImportItem().should('have.class', 'active');
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
			navbarPage
				.getMobileNavItemsButton()
				.contains(authorizedNavbarItems.reports);
			reportsPage.getTitle().should('be.visible');
		});

		it('navigates to Transactions', () => {
			categoriesApi.getAllCategories();
			transactionsApi.searchForTransactions();
			needsAttentionApi.getNeedsAttention_all();
			mountApp({
				viewport: 'mobile',
				initialRoute: '/expense-tracker/categories'
			});
			categoriesListPage.getTitle().should('be.visible');
			navbarPage.getMobileNavItemsButton().click();
			navbarPage.getTransactionsItem().click();
			navbarPage
				.getMobileNavItemsButton()
				.contains(authorizedNavbarItems.transactions);
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
			navbarPage
				.getMobileNavItemsButton()
				.contains(authorizedNavbarItems.categories);
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
			navbarPage
				.getMobileNavItemsButton()
				.contains(authorizedNavbarItems.import);
			importPage.getTitle().should('be.visible');
		});
	});
});
