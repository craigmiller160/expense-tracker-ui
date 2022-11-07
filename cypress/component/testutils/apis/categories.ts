import Chainable = Cypress.Chainable;

export const getAllCategories = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/categories', {
		fixture: 'allCategories.json'
	});
