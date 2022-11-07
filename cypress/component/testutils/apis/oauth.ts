import Chainable = Cypress.Chainable;

export const getAuthUser_isAuthorized = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/oauth/user', {
		fixture: 'authorizedUser.json'
	});

export const getAuthUser_isNotAuthorized = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/oauth/user', {
		statusCode: 401
	});
