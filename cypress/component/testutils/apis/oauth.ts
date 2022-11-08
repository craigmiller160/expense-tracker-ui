import Chainable = Cypress.Chainable;

const getAuthUser_isAuthorized = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/oauth/user', {
		fixture: 'authorizedUser.json'
	});

const getAuthUser_isNotAuthorized = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/oauth/user', {
		statusCode: 401
	});

export const oauthApi = {
	getAuthUser_isAuthorized,
	getAuthUser_isNotAuthorized
};
