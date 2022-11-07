import { mountApp } from './testutils/mountApp';
import { getAllCategories } from './testutils/apis/categories';
import { orderedAuthorizedNavbarItems } from './testutils/constants/navbar';

describe('Authorization.cy.tsx', () => {
	it('The app displays in an unauthorized state', () => {
		mountApp({
			isAuthorized: false
		});
		cy.get('#expense-tracker-navbar-title').contains('Expense Tracker');
		cy.get('#navbar-auth-button').contains('Login');
		cy.get('#navbar .LinkButton').should('not.exist');
		cy.get('.Welcome').find('h4').contains('Welcome to Expense Tracker');
	});

	it('The app displays in an authorized state', () => {
		getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
		cy.get('#navbar')
			.find('.LinkButton')
			.should('have.length', 3)
			.each(($node, index) =>
				expect($node.text()).to.eq(orderedAuthorizedNavbarItems[index])
			);
		cy.get('.Welcome').should('not.exist');
	});
});
