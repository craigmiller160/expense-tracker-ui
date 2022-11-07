import Chainable = Cypress.Chainable;

export const getAllCategories = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/categories', {
		fixture: 'allCategories.json'
	});

export const createCategory = (): Chainable<null> =>
	cy
		.intercept('post', '/expense-tracker/api/categories')
		.as('createCategory');

export const deleteCategory = (id: string): Chainable<null> =>
	cy
		.intercept('delete', `/expense-tracker/api/categories/${id}`)
		.as(`deleteCategory_${id}`);
