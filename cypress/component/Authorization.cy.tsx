import { mountApp } from './testutils/mountApp';
import { categoriesApi } from './testutils/apis/categories';
import { orderedAuthorizedNavbarItems } from './testutils/constants/navbar';
import { navbarPage } from './testutils/pages/navbar';
import { welcomePage } from './testutils/pages/welcome';

describe('Authorization.cy.tsx', () => {
	it('The app displays in an unauthorized state', () => {
		mountApp({
			isAuthorized: false
		});
		navbarPage.getTitle().contains('Expense Tracker');
		navbarPage.getAuthButton().contains('Login');
		navbarPage.getNavbarItems().should('not.exist');
		welcomePage.getTitle().contains('Welcome to Expense Tracker');
	});

	it('The app displays in an authorized state', () => {
		categoriesApi.getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
		navbarPage.getTitle().contains('Expense Tracker');
		navbarPage.getAuthButton().contains('Logout');
		navbarPage
			.getNavbarItems()
			.should('have.length', 3)
			.each(($node, index) =>
				expect($node.text()).to.eq(orderedAuthorizedNavbarItems[index])
			);
		welcomePage.getTitle().should('not.exist');
	});
});
