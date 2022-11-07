import Chainable = Cypress.Chainable;

export const getAllCategories = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/categories', {
		fixture: 'allCategories.json'
	});

export const createCategory = (): Chainable<null> =>
	cy
		.intercept('post', '/expense-tracker/api/categories')
		.as('createCategory');
