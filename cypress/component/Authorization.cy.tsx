import { mountApp } from './testutils/mountApp';

describe('Authorization.cy.tsx', () => {
	it('The app displays in an unauthorized state', () => {
		mountApp({
			isAuthorized: false
		});
		cy.get('#expense-tracker-navbar-title').contains('Expense Tracker');
		cy.get('#navbar-auth-button').contains('Login');
		cy.get('#navbar').find('.LinkButton').should('have.length', 0);
	});

	it('The app displays in an authorized state', () => {
		// TODO need to intercept all API calls... somehow
		throw new Error();
	});
});
